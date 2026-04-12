import { Heart, MessageCircle, UserPlus } from "lucide-react";

type NotificationItem = {
  id: string;
  type: "like" | "comment" | "follow";
  username: string;
  text: string;
  time: string;
};

const MOCK_NOTIFICATIONS: ReadonlyArray<NotificationItem> = [
  {
    id: "n1",
    type: "like",
    username: "emma_ui",
    text: "liked your photo.",
    time: "2m",
  },
  {
    id: "n2",
    type: "comment",
    username: "john_doe",
    text: "commented: Amazing shot 🔥",
    time: "12m",
  },
  {
    id: "n3",
    type: "follow",
    username: "zain_dev",
    text: "started following you.",
    time: "1h",
  },
];

function NotificationIcon({ type }: { type: NotificationItem["type"] }) {
  if (type === "like") return <Heart className="h-4 w-4 text-red-500" />;
  if (type === "comment")
    return <MessageCircle className="h-4 w-4 text-blue-500" />;
  return <UserPlus className="h-4 w-4 text-green-600" />;
}

function NotificationsPage() {
  return (
    <div className="mx-auto w-full max-w-[630px] space-y-4 px-1 py-4">
      <h1 className="text-xl font-semibold" style={{ color: "black" }}>
        Notifications
      </h1>

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        {MOCK_NOTIFICATIONS.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              index !== MOCK_NOTIFICATIONS.length - 1
                ? "border-b border-zinc-100"
                : ""
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
              <NotificationIcon type={item.type} />
            </div>

            <p className="text-sm text-zinc-800">
              <span className="font-semibold">{item.username}</span> {item.text}
            </p>

            <span className="ml-auto text-xs text-zinc-500">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
