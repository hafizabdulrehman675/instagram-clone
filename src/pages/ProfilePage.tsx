import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid3X3,
  Bookmark,
  Tag,
  Play,
  Settings,
  Plus,
  ChevronDown,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FeedPost } from "@/features/posts/types";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setActiveModal } from "@/features/ui/redux/uiSlice";

/* ─── Highlight bubble ──────────────────────────────────────────── */
const HIGHLIGHTS = [
  { id: "h1", label: "Travel", emoji: "✈️" },
  { id: "h2", label: "Food", emoji: "🍜" },
  { id: "h3", label: "Dev", emoji: "💻" },
  { id: "h4", label: "Vibes", emoji: "🎵" },
];

/* ─── IG gradient ───────────────────────────────────────────────── */
const IG_GRADIENT =
  "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)";

/* ShadCN Button: no hover/active visual change (static chrome) */
const profileBtnSecondary =
  "h-8 rounded-lg border-0 bg-zinc-100 px-4 text-[14px] font-semibold text-zinc-900 shadow-none hover:bg-zinc-100 hover:text-zinc-900 active:translate-y-0 active:bg-zinc-100";
const profileBtnGhostIcon =
  "size-auto rounded-full p-1.5 text-zinc-700 shadow-none hover:bg-transparent hover:text-zinc-700 active:translate-y-0 active:bg-transparent";
const profileBtnGhostRow =
  "h-auto justify-start gap-0 p-0 text-left shadow-none hover:bg-transparent active:translate-y-0 active:bg-transparent";
const profileBtnGhostTab =
  "rounded-none border-t px-5 py-3 text-[12px] font-semibold tracking-widest shadow-none hover:bg-transparent active:translate-y-0 active:bg-transparent";
const profileBtnLinkBlue =
  "mt-5 h-auto p-0 text-[13px] font-semibold text-blue-500 shadow-none hover:bg-transparent hover:text-blue-500 hover:no-underline active:bg-transparent active:text-blue-500";
const profileBtnHighlight =
  "flex h-auto shrink-0 flex-col items-center gap-1.5 p-0 shadow-none hover:bg-transparent active:translate-y-0 active:bg-transparent";

/* ─── Post thumbnail ────────────────────────────────────────────── */
function PostThumb({ post, onClick }: { post: FeedPost; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="relative aspect-square h-auto w-full overflow-hidden rounded-none bg-zinc-100 p-0 shadow-none hover:bg-zinc-100 active:translate-y-0"
    >
      <img
        src={post.imageUrl}
        alt={post.caption}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </Button>
  );
}

/* ─── Post detail dialog ─────────────────────────────────────────── */
function PostDialog({
  post,
  onClose,
}: {
  post: FeedPost | null;
  onClose: () => void;
}) {
  if (!post) return null;
  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-xl border-0 shadow-2xl">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="aspect-square w-full sm:w-1/2 bg-black shrink-0">
            <img
              src={post.imageUrl}
              alt={post.caption}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Info */}
          <div className="flex flex-1 flex-col p-5">
            <DialogHeader className="mb-3">
              <DialogTitle className="text-[14px] font-semibold">
                {post.username}
              </DialogTitle>
            </DialogHeader>
            <p className="text-[13.5px] leading-snug text-zinc-800 flex-1">
              <span className="font-semibold mr-1.5">{post.username}</span>
              {post.caption}
            </p>
            <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-4 text-[13px] text-zinc-500">
              <span>{post.likesCount.toLocaleString()} likes</span>
              <span>{post.commentsCount} comments</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
function ProfilePage() {
  const authUser = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const userPosts = useAppSelector((s) => {
    if (!s.auth.user) return [] as FeedPost[];
    const username = s.auth.user.username;
    return s.posts.feedPostIds
      .map((id) => s.posts.postsById[id])
      .filter((p): p is FeedPost => Boolean(p) && p.username === username);
  });

  const savedPosts = useAppSelector((s) =>
    s.posts.feedPostIds
      .map((id) => s.posts.postsById[id])
      .filter((p): p is FeedPost => Boolean(p) && p.isSaved),
  );

  const [tab, setTab] = useState<"posts" | "reels" | "saved" | "tagged">(
    "posts",
  );
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  const stats = useMemo(
    () => ({
      posts: userPosts.length,
      followers: 1_284,
      following: 320,
    }),
    [userPosts.length],
  );

  if (!authUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-zinc-500">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  /* ── Tab grid content ── */
  const gridPosts = tab === "saved" ? savedPosts : userPosts;

  const EmptyState = ({
    icon: Icon,
    title,
    sub,
  }: {
    icon: React.ElementType;
    title: string;
    sub: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex size-20 items-center justify-center rounded-full border-2 border-zinc-300">
        <Icon size={36} strokeWidth={1.25} className="text-zinc-400" />
      </div>
      <p className="text-[22px] font-bold text-zinc-900">{title}</p>
      <p className="mt-2 max-w-[260px] text-[14px] text-zinc-500 leading-snug">
        {sub}
      </p>
      {tab === "posts" && (
        <Button
          type="button"
          variant="link"
          className={profileBtnLinkBlue}
          onClick={() => dispatch(setActiveModal("createPost"))}
        >
          Share your first photo
        </Button>
      )}
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.cdnfonts.com/css/billabong');`}</style>

      <div className="mx-auto w-full max-w-[935px] px-4 md:px-8">
        {/* ══ Header ═══════════════════════════════════════════════ */}
        <div className="flex flex-col gap-6 pb-6 pt-8 sm:flex-row sm:items-start sm:gap-10 md:gap-16">
          {/* Avatar */}
          <div className="flex justify-center sm:block sm:shrink-0">
            <div
              className="rounded-full p-[3px]"
              style={{ background: IG_GRADIENT }}
            >
              <div className="rounded-full bg-white p-[3px]">
                <Avatar className="size-[86px] sm:size-[150px]">
                  <AvatarImage
                    src={authUser.avatarUrl}
                    alt={authUser.username}
                  />
                  <AvatarFallback className="text-xl font-semibold">
                    {authUser.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Username row */}
            <div className="flex flex-wrap items-center gap-3">
              <h2
                className="text-[22px] font-normal leading-none"
                style={{ color: "black" }}
              >
                {authUser.username}
              </h2>
              <Button
                variant="secondary"
                size="sm"
                className={profileBtnSecondary}
                asChild
              >
                <Link to="/profile/edit">Edit profile</Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className={profileBtnSecondary}
                onClick={() => dispatch(setActiveModal("createPost"))}
              >
                <Plus size={15} className="mr-1" />
                Create
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Settings"
                className={profileBtnGhostIcon}
              >
                <Settings size={22} strokeWidth={1.75} />
              </Button>
            </div>

            {/* Stats (desktop) */}
            <div className="hidden sm:flex items-center gap-10">
              {[
                { value: stats.posts, label: "posts" },
                { value: stats.followers.toLocaleString(), label: "followers" },
                { value: stats.following, label: "following" },
              ].map(({ value, label }) => (
                <Button
                  key={label}
                  type="button"
                  variant="ghost"
                  className={`${profileBtnGhostRow} justify-center text-center text-zinc-900`}
                >
                  <span className="text-[15px] font-bold">{value}</span>
                  <span className="ml-1 text-[15px] font-normal">{label}</span>
                </Button>
              ))}
            </div>

            {/* Name + bio */}
            <div className="flex flex-col" style={{ alignItems: "start" }}>
              <p className="text-[14px] font-semibold leading-snug pb-1">
                {authUser.fullName}
              </p>
              <p className="mt-0.5 text-[14px] leading-snug text-zinc-700">
                ✦ Building cool things with React &amp; TypeScript
              </p>
              <Button
                type="button"
                variant="ghost"
                className={`${profileBtnGhostRow} mt-0.5 flex items-center gap-0.5 text-[14px] font-semibold text-zinc-900`}
              >
                more <ChevronDown size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* ── Mobile stats ── */}
        <div className="flex items-center justify-around border-y border-zinc-200 py-3 sm:hidden">
          {[
            { value: stats.posts, label: "Posts" },
            { value: stats.followers.toLocaleString(), label: "Followers" },
            { value: stats.following, label: "Following" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-[15px] font-bold leading-snug">
                {value}
              </span>
              <span className="text-[12px] text-zinc-500">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Story highlights ── */}
        <div
          className="flex gap-5 overflow-x-auto py-5"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Add new */}
          <Button type="button" variant="ghost" className={profileBtnHighlight}>
            <div className="flex size-[77px] items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 text-2xl">
              <Plus size={24} strokeWidth={1.5} className="text-zinc-500" />
            </div>
            <span className="text-[12px] text-zinc-600">New</span>
          </Button>

          {HIGHLIGHTS.map((h) => (
            <Button
              key={h.id}
              type="button"
              variant="ghost"
              className={profileBtnHighlight}
            >
              <div className="flex size-[77px] items-center justify-center rounded-full bg-zinc-100 text-[28px] ring-1 ring-zinc-200">
                {h.emoji}
              </div>
              <span className="text-[12px] text-zinc-700">{h.label}</span>
            </Button>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="border-t border-zinc-200">
          <div className="flex justify-center gap-0">
            {[
              { key: "posts", icon: Grid3X3, label: "POSTS" },
              { key: "reels", icon: Play, label: "REELS" },
              { key: "saved", icon: Bookmark, label: "SAVED" },
              { key: "tagged", icon: Tag, label: "TAGGED" },
            ].map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                type="button"
                variant="ghost"
                onClick={() => setTab(key as typeof tab)}
                className={`${profileBtnGhostTab} -mt-px flex items-center gap-1.5 border-t ${
                  tab === key
                    ? "border-zinc-900 text-zinc-900 hover:text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-400"
                }`}
              >
                <Icon size={13} strokeWidth={2} />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>

          {/* ── Grid ── */}
          <div className="mt-0.5">
            {tab === "tagged" ? (
              <EmptyState
                icon={Tag}
                title="Photos of you"
                sub="When people tag you in photos, they'll appear here."
              />
            ) : tab === "reels" ? (
              <EmptyState
                icon={Play}
                title="No reels yet"
                sub="Reels you create will appear here."
              />
            ) : gridPosts.length === 0 ? (
              <EmptyState
                icon={Grid3X3}
                title={
                  tab === "saved" ? "Save photos and videos" : "Share photos"
                }
                sub={
                  tab === "saved"
                    ? "Save photos and videos that you want to see again."
                    : "When you share photos, they'll appear on your profile."
                }
              />
            ) : (
              <div className="grid grid-cols-3 gap-[3px]">
                {gridPosts.map((post) => (
                  <PostThumb
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* bottom padding for mobile nav */}
        <div className="h-16 md:h-6" />
      </div>

      {/* ── Post detail dialog ── */}
      <PostDialog post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}

export default ProfilePage;
