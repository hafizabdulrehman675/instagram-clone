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
];

type PostCardProps = {
  post: FeedPost;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
};

function PostCard({ post, onToggleLike, onToggleSave }: PostCardProps) {
  const [commentInput, setCommentInput] = useState<string>("");

  return (
    <article className="border-b border-zinc-200 bg-white">
      <div className="flex items-center justify-between px-3 py-3 md:px-0">
        <div className="flex items-center gap-2.5">
          <div className="relative size-9 shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                padding: "2px",
              }}
            >
              <div className="size-full rounded-full bg-white p-[2px]">
                <Avatar className="size-full">
                  <AvatarImage src={post.avatarUrl} alt={post.username} />
                  <AvatarFallback className="text-xs">
                    {post.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[13.5px] font-semibold leading-tight">
              {post.username}
            </p>
            {post.location ? (
              <p className="text-[11px] leading-tight text-zinc-500">
                {post.location}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          aria-label="Post options"
          className="rounded-full p-1.5 transition hover:bg-zinc-100 active:scale-90"
        >
          <MoreHorizontal size={20} strokeWidth={1.8} />
        </button>
      </div>

      <div className="w-full overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="aspect-square w-full select-none object-cover"
          draggable={false}
          onDoubleClick={() => onToggleLike(post.id)}
        />
      </div>

      <div className="px-3 pb-1 pt-2.5 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
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

            <button
              type="button"
              aria-label="Comment"
              className="group rounded-full p-0.5 transition hover:text-zinc-600 active:scale-90"
            >
              <MessageCircle
                size={26}
                strokeWidth={1.8}
                className="group-hover:stroke-zinc-500"
              />
            </button>

            <button
              type="button"
              aria-label="Share"
              className="group rounded-full p-0.5 transition hover:text-zinc-600 active:scale-90"
            >
              <Send
                size={24}
                strokeWidth={1.8}
                className="-rotate-12 group-hover:stroke-zinc-500"
              />
            </button>
          </div>

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

        <p className="mt-1.5 text-[13.5px] font-semibold">
          {post.likesCount.toLocaleString()} likes
        </p>

        <p className="mt-0.5 text-[13.5px] leading-snug">
          <span className="mr-1.5 font-semibold">{post.username}</span>
          {post.caption}
        </p>

        {post.commentsCount > 0 ? (
          <button
            type="button"
            className="mt-1 text-[13.5px] text-zinc-500 transition hover:text-zinc-700"
          >
            View all {post.commentsCount} comments
          </button>
        ) : null}

        <div className="mt-2 flex items-center gap-2 border-t border-zinc-100 pt-2.5">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-[13.5px] text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <button
            type="button"
            className="shrink-0 text-zinc-400 transition hover:text-zinc-600"
          >
            <Smile size={18} strokeWidth={1.8} />
          </button>
          {commentInput.trim() ? (
            <button
              type="button"
              onClick={() => setCommentInput("")}
              className="shrink-0 text-[13px] font-semibold text-blue-500 transition hover:text-blue-700"
            >
              Post
            </button>
          ) : null}
        </div>

        <p className="mt-1 pb-2.5 text-[11px] uppercase tracking-wide text-zinc-400">
          {post.postedAtLabel}
        </p>
      </div>
    </article>
  );
}

function FeedPage() {
  const dispatch = useAppDispatch();

  const posts = useAppSelector((state) =>
    state.posts.feedPostIds
      .map((id) => state.posts.postsById[id])
      .filter((post): post is FeedPost => Boolean(post))
  );

  function handleToggleLike(postId: string) {
    dispatch(toggleLike({ postId }));
  }

  function handleToggleSave(postId: string) {
    dispatch(toggleSave({ postId }));
  }

  return (
    <div className="w-full pb-20 md:pb-6">
      <section className="border-b border-zinc-200 bg-white px-3 py-3 md:px-0">
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1">
          {STORIES.map((story, i) => (
            <button
              type="button"
              key={story.id}
              className="flex min-w-[66px] flex-col items-center gap-1.5 transition active:opacity-75"
            >
              <div className="relative size-[66px] shrink-0">
                {i === 0 ? (
                  <div className="flex size-full items-center justify-center overflow-hidden rounded-full ring-[1.5px] ring-zinc-300 ring-offset-1">
                    <Avatar className="size-full">
                      <AvatarImage src={story.avatarUrl} alt={story.username} />
                      <AvatarFallback className="text-sm">
                        {story.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 flex size-[20px] items-center justify-center rounded-full bg-blue-500 text-sm font-bold leading-none text-white ring-2 ring-white">
                      +
                    </span>
                  </div>
                ) : (
                  <div
                    className="size-full rounded-full p-[2.5px]"
                    style={{
                      background:
                        "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                    }}
                  >
                    <div className="size-full rounded-full bg-white p-[2.5px]">
                      <Avatar className="size-full">
                        <AvatarImage
                          src={story.avatarUrl}
                          alt={story.username}
                        />
                        <AvatarFallback className="text-sm">
                          {story.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                )}
              </div>
              <p className="max-w-[66px] truncate text-[11.5px] text-zinc-700">
                {i === 0 ? "Your story" : story.username}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-0">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  );
}

export default FeedPage;
