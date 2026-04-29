import { useMemo } from "react";
import { Heart, Send, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveModal } from "@/features/ui/redux/uiSlice";

type NotificationItem = {
  id: string;
  username: string;
  userAvatarUrl: string;
  text: string;
  type: "incomingRequest" | "outgoingRequest" | "followingYou";
};

function NotificationIcon({ type }: { type: NotificationItem["type"] }) {
  if (type === "incomingRequest")
    return <Heart className="h-4 w-4 text-pink-500" />;
  if (type === "outgoingRequest")
    return <Send className="h-4 w-4 text-blue-500" />;
  return <UserPlus className="h-4 w-4 text-green-600" />;
}

function NotificationsPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const social = useAppSelector((s) => s.social);
  const usersById = useAppSelector((s) => s.users.usersById);

  const followActivityCount = useMemo(() => {
    if (!authUser) return 0;
    return Object.values(social.requestsById).filter(
      (r) => r.toUserId === authUser.id && r.status === "pending",
    ).length;
  }, [authUser, social.requestsById]);

  const notifications = useMemo((): NotificationItem[] => {
    if (!authUser) return [];

    // Keep one "best" notification per user to avoid stale/conflicting entries.
    // Priority: incoming request > outgoing request > already following you.
    const byUserId = new Map<string, NotificationItem>();

    for (const req of Object.values(social.requestsById)) {
      if (req.status !== "pending") continue;
      if (req.toUserId === authUser.id) {
        const from = usersById[req.fromUserId];
        byUserId.set(req.fromUserId, {
          id: `incoming_${req.id}`,
          username: from?.username ?? "unknown_user",
          userAvatarUrl: from?.avatarUrl ?? "https://i.pravatar.cc/100?u=unknown",
          text: "requested to follow you.",
          type: "incomingRequest",
        });
      }
    }

    for (const req of Object.values(social.requestsById)) {
      if (req.status !== "pending") continue;
      if (req.fromUserId !== authUser.id) continue;
      if (byUserId.has(req.toUserId)) continue;
      const to = usersById[req.toUserId];
      byUserId.set(req.toUserId, {
        id: `outgoing_${req.id}`,
        username: to?.username ?? "unknown_user",
        userAvatarUrl: to?.avatarUrl ?? "https://i.pravatar.cc/100?u=unknown",
        text: "has not accepted your follow request yet.",
        type: "outgoingRequest",
      });
    }

    for (const [followerId, followingIds] of Object.entries(
      social.followingByUserId,
    )) {
      if (followerId === authUser.id) continue;
      if (!followingIds.includes(authUser.id)) continue;
      if (byUserId.has(followerId)) continue;
      const from = usersById[followerId];
      byUserId.set(followerId, {
        id: `follower_${followerId}`,
        username: from?.username ?? "unknown_user",
        userAvatarUrl: from?.avatarUrl ?? "https://i.pravatar.cc/100?u=unknown",
        text: "is following you.",
        type: "followingYou",
      });
    }

    const order: Record<NotificationItem["type"], number> = {
      incomingRequest: 0,
      outgoingRequest: 1,
      followingYou: 2,
    };

    return Array.from(byUserId.values()).sort(
      (a, b) => order[a.type] - order[b.type],
    );
  }, [authUser, social.followingByUserId, social.requestsById, usersById]);

  return (
    <div className="mx-auto w-full max-w-[630px] space-y-4 px-1 py-4">
      <h1 className="text-xl font-semibold" style={{ color: "black" }}>
        Notifications
      </h1>

      <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Follow requests</p>
          <p className="text-xs text-zinc-500">
            Approve who can follow you back.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="relative shrink-0 rounded-lg text-xs font-semibold"
          onClick={() => dispatch(setActiveModal("followRequests"))}
        >
          Open
          {followActivityCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
              {followActivityCount > 9 ? "9+" : followActivityCount}
            </span>
          ) : null}
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-semibold text-zinc-900">
              No notifications yet
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Follow activity will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                index !== notifications.length - 1 ? "border-b border-zinc-100" : ""
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                <NotificationIcon type={item.type} />
              </div>

              <Link
                to={`/profile/${encodeURIComponent(item.username)}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <img
                  src={item.userAvatarUrl}
                  alt={item.username}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <p className="truncate text-sm text-zinc-800">
                  <span className="font-semibold">{item.username}</span>{" "}
                  {item.text}
                </p>
              </Link>

              <span className="ml-auto text-xs text-zinc-500">now</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
