import { useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleLike, toggleSave } from "@/features/posts/redux/postsSlice";
import type { FeedPost, Story } from "@/features/posts/types";

const STORIES: ReadonlyArray<Story> = [
  { id: "s1", username: "you", avatarUrl: "https://i.pravatar.cc/100?u=you" },
  { id: "s2", username: "john", avatarUrl: "https://i.pravatar.cc/100?u=john" },
  { id: "s3", username: "emma", avatarUrl: "https://i.pravatar.cc/100?u=emma" },
  { id: "s4", username: "zain", avatarUrl: "https://i.pravatar.cc/100?u=zain" },
  { id: "s5", username: "alex", avatarUrl: "https://i.pravatar.cc/100?u=alex" },
  { id: "s6", username: "sara", avatarUrl: "https://i.pravatar.cc/100?u=sara" },
  { id: "s7", username: "mike", avatarUrl: "https://i.pravatar.cc/100?u=mike" },
];

// ── Instagram gradient ─────────────────────────────────────────────────────
const IG_GRADIENT =
  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

// ── Story ring wrapper ─────────────────────────────────────────────────────
function StoryRing({
  children,
  active = true,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className="size-full rounded-full p-[2.5px]"
      style={{ background: active ? IG_GRADIENT : "#e5e7eb" }}
    >
      <div className="size-full rounded-full bg-white p-[2.5px]">
        {children}
      </div>
    </div>
  );
}

// ── Stories bar ────────────────────────────────────────────────────────────
function StoriesBar({ stories }: { stories: ReadonlyArray<Story> }) {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-4 md:px-4">
      <div
        className="flex gap-5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {stories.map((story, i) => (
          <button
            key={story.id}
            type="button"
            className="flex shrink-0 flex-col items-center gap-1.5 transition-opacity active:opacity-70"
          >
            <div className="relative size-16">
              {i === 0 ? (
                /* Your story */
                <>
                  <div className="size-full rounded-full ring-1 ring-zinc-300 overflow-hidden">
                    <Avatar className="size-full">
                      <AvatarImage src={story.avatarUrl} alt={story.username} />
                      <AvatarFallback className="text-sm">
                        {story.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="absolute -bottom-0.5 right-0 flex size-5 items-center justify-center rounded-full bg-blue-500 text-[13px] font-bold text-white ring-2 ring-white leading-none">
                    +
                  </span>
                </>
              ) : (
                <StoryRing>
                  <Avatar className="size-full">
                    <AvatarImage src={story.avatarUrl} alt={story.username} />
                    <AvatarFallback className="text-sm">
                      {story.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </StoryRing>
              )}
            </div>
            <p className="max-w-[64px] truncate text-[11.5px] text-zinc-700 font-normal">
              {i === 0 ? "Your story" : story.username}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Post card ──────────────────────────────────────────────────────────────
type PostCardProps = {
  post: FeedPost;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
};

function PostCard({ post, onToggleLike, onToggleSave }: PostCardProps) {
  const [commentInput, setCommentInput] = useState<string>("");
  const [heartBurst, setHeartBurst] = useState(false);

  function handleDoubleTap() {
    if (!post.isLiked) onToggleLike(post.id);
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 800);
  }

  return (
    <article className="border-b border-zinc-200 bg-white">
      {/* ── Post header ── */}
      <div className="flex items-center justify-between px-4 py-3 md:px-3">
        <div className="flex items-center gap-2.5">
          {/* Story-ring avatar */}
          <div className="relative size-9 shrink-0">
            <StoryRing>
              <Avatar className="size-full">
                <AvatarImage src={post.avatarUrl} alt={post.username} />
                <AvatarFallback className="text-[10px]">
                  {post.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </StoryRing>
          </div>

          <div>
            <p className="text-[13.5px] font-semibold leading-tight hover:underline cursor-pointer">
              {post.username}
            </p>
            {post.location && (
              <p className="text-[11px] leading-tight text-zinc-500">
                {post.location}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Post options"
          className="rounded-full p-1.5 text-zinc-700 transition hover:bg-zinc-100 active:scale-90"
        >
          <MoreHorizontal size={20} strokeWidth={1.8} />
        </button>
      </div>

      {/* ── Post image (responsive + double-tap) ── */}
      <div
        className="relative w-full overflow-hidden bg-zinc-100"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="max-h-[400px] w-full object-fill select-none"
          // style={{ aspectRatio: "1 / 1" }}
          draggable={false}
        />
        {/* Double-tap heart burst */}
        {heartBurst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart
              size={90}
              className="fill-white stroke-white opacity-0 animate-[heartPop_0.8s_ease-out_forwards]"
            />
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="px-4 pb-1 pt-3 md:px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Like */}
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              aria-label={post.isLiked ? "Unlike" : "Like"}
              className="group rounded-full p-0.5 transition active:scale-90"
            >
              <Heart
                size={26}
                strokeWidth={1.8}
                className={`transition-all duration-200 ${
                  post.isLiked
                    ? "scale-110 fill-red-500 stroke-red-500"
                    : "group-hover:stroke-red-400"
                }`}
              />
            </button>

            {/* Comment */}
            <button
              type="button"
              aria-label="Comment"
              className="group rounded-full p-0.5 transition active:scale-90"
            >
              <MessageCircle
                size={26}
                strokeWidth={1.8}
                className="group-hover:stroke-zinc-500 transition-colors"
              />
            </button>

            {/* Share */}
            <button
              type="button"
              aria-label="Share"
              className="group rounded-full p-0.5 transition active:scale-90"
            >
              <Send
                size={24}
                strokeWidth={1.8}
                className="-rotate-12 group-hover:stroke-zinc-500 transition-colors"
              />
            </button>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={() => onToggleSave(post.id)}
            aria-label={post.isSaved ? "Unsave" : "Save"}
            className="group rounded-full p-0.5 transition active:scale-90"
          >
            <Bookmark
              size={26}
              strokeWidth={1.8}
              className={`transition-all duration-200 ${
                post.isSaved
                  ? "fill-zinc-900 stroke-zinc-900"
                  : "group-hover:stroke-zinc-500"
              }`}
            />
          </button>
        </div>

        {/* Likes count */}
        <p className="mt-2 text-[13.5px] font-semibold">
          {post.likesCount.toLocaleString()} likes
        </p>

        {/* Caption */}
        <p className="mt-0.5 text-[13.5px] leading-snug">
          <span className="mr-1.5 font-semibold cursor-pointer hover:underline">
            {post.username}
          </span>
          <span className="text-zinc-800">{post.caption}</span>
        </p>

        {/* Comments */}
        {post.commentsCount > 0 && (
          <button
            type="button"
            className="mt-1 block text-[13.5px] text-zinc-400 transition hover:text-zinc-600"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Add comment */}
        <div className="mt-2 flex items-center gap-2 border-t border-zinc-100 pt-2.5">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-[13.5px] text-zinc-900 outline-none placeholder:text-zinc-400 caret-zinc-700"
          />
          <button
            type="button"
            className="shrink-0 text-zinc-400 transition hover:text-zinc-600"
          >
            <Smile size={18} strokeWidth={1.8} />
          </button>
          {commentInput.trim() && (
            <button
              type="button"
              onClick={() => setCommentInput("")}
              className="shrink-0 text-[13px] font-semibold text-blue-500 transition hover:text-blue-700 active:scale-95"
            >
              Post
            </button>
          )}
        </div>

        {/* Timestamp */}
        <p className="mt-1 pb-3 text-[11px] uppercase tracking-wide text-zinc-400">
          {post.postedAtLabel}
        </p>
      </div>
    </article>
  );
}

// ── Feed page ──────────────────────────────────────────────────────────────
function FeedPage() {
  const dispatch = useAppDispatch();

  const posts = useAppSelector((state) =>
    state.posts.feedPostIds
      .map((id) => state.posts.postsById[id])
      .filter((post): post is FeedPost => Boolean(post)),
  );

  function handleToggleLike(postId: string) {
    dispatch(toggleLike({ postId }));
  }

  function handleToggleSave(postId: string) {
    dispatch(toggleSave({ postId }));
  }

  return (
    <>
      {/* Heart burst animation */}
      {/* <style>{`
        @keyframes heartPop {
          0%   { opacity: 0;   transform: scale(0.4); }
          30%  { opacity: 1;   transform: scale(1.15); }
          60%  { opacity: 1;   transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.05); }
        }
      `}</style> */}

      <div
        // className="w-full max-w-[470px] mx-auto"
        className="w-full mx-auto"
      >
        {/* Stories */}
        <StoriesBar stories={STORIES} />

        {/* Posts */}
        <div>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <div
                className="mb-5 flex size-20 items-center justify-center rounded-full"
                style={{ background: IG_GRADIENT }}
              >
                <Heart size={36} className="fill-white stroke-none" />
              </div>
              <p className="text-xl font-semibold text-zinc-900">
                No posts yet
              </p>
              <p className="mt-1.5 text-sm text-zinc-500">
                Follow people to see their photos and videos here.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default FeedPage;
