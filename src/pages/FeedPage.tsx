import { useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Smile,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addComment,
  toggleLike,
  toggleSave,
} from "@/features/posts/redux/postsSlice";
import type { FeedPost, PostComment, Story } from "@/features/posts/types";

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
    <section className="border-b border-zinc-200 bg-white px-1 py-4 md:px-1">
      <div
        className="flex gap-4 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {stories.map((story, i) => (
          <Button
            key={story.id}
            type="button"
            variant="ghost"
            className="h-auto min-h-0 w-auto shrink-0 cursor-pointer flex-col gap-3 rounded-xl p-0 font-normal hover:bg-transparent flex-1"
          >
            <div className="relative size-16">
              {i === 0 ? (
                <>
                  <div className="size-full overflow-hidden rounded-full ring-1 ring-zinc-200 ring-inset">
                    <Avatar className="size-full">
                      <AvatarImage src={story.avatarUrl} alt={story.username} />
                      <AvatarFallback className="text-sm">
                        {story.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex size-5.5 items-center justify-center rounded-full bg-[#0095f6] text-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] ring-[2.5px] ring-white"
                    aria-hidden
                  >
                    <Plus
                      className="size-3.5 stroke-[2.75]"
                      strokeLinecap="round"
                    />
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
            <p className="max-w-16 truncate text-[14px] font-normal text-zinc-700">
              {i === 0 ? "Your story" : story.username}
            </p>
          </Button>
        ))}
      </div>
    </section>
  );
}

// ── Comment thread (nested replies; ShadCN has no List — use Card + roles) ─
function CommentTree({
  comments,
  parentId,
  depth,
  onReply,
}: {
  comments: PostComment[];
  parentId: string | null;
  depth: number;
  onReply: (c: PostComment) => void;
}) {
  const nodes = comments.filter((c) => c.parentId === parentId);
  if (nodes.length === 0) return null;

  return (
    <div
      role="list"
      className={
        depth === 0
          ? "flex w-full flex-col gap-0 text-left"
          : "mt-2 flex w-full flex-col gap-2 border-l border-zinc-200 pl-3 text-left dark:border-zinc-700"
      }
    >
      {nodes.map((c, index) => (
        <div key={c.id} role="listitem" className="w-full text-left">
          <div className="flex w-full items-start gap-3 text-left">
            <Avatar className="mt-0.5 size-8 shrink-0">
              <AvatarImage src={c.avatarUrl} alt="" />
              <AvatarFallback className="text-[10px]">
                {c.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-left text-[13.5px] leading-snug text-zinc-900">
                <span className="font-semibold">{c.username}</span>{" "}
                <span className="font-normal text-zinc-800">{c.text}</span>
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-start gap-x-3 gap-y-1 text-left text-[11px] text-zinc-400">
                <span>{c.postedAtLabel}</span>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto min-h-0 p-0 font-normal text-[11px] text-zinc-500 hover:bg-transparent hover:text-zinc-500 dark:hover:bg-transparent"
                  onClick={() => onReply(c)}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
          <CommentTree
            comments={comments}
            parentId={c.id}
            depth={depth + 1}
            onReply={onReply}
          />
          {depth === 0 && index < nodes.length - 1 ? (
            <Separator className="my-4 bg-zinc-200 dark:bg-zinc-800" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// ── Post card ──────────────────────────────────────────────────────────────
type PostCardProps = {
  post: FeedPost;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
};

function PostCard({ post, onToggleLike, onToggleSave }: PostCardProps) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const [commentInput, setCommentInput] = useState<string>("");
  const [replyTo, setReplyTo] = useState<PostComment | null>(null);
  const [commentsVisible, setCommentsVisible] = useState(true);

  const comments = post.comments ?? [];
  const hasComments = comments.length > 0;

  function handleDoubleTap() {
    if (!post.isLiked) onToggleLike(post.id);
  }

  function handlePostComment() {
    const text = commentInput.trim();
    if (!text) return;
    dispatch(
      addComment({
        postId: post.id,
        text,
        parentId: replyTo?.id ?? null,
        username: authUser?.username ?? "you",
        avatarUrl: authUser?.avatarUrl ?? "https://i.pravatar.cc/100?u=you",
      }),
    );
    setCommentInput("");
    setReplyTo(null);
    setCommentsVisible(true);
  }

  function toggleCommentsPanel() {
    setCommentsVisible((v) => !v);
  }

  return (
    <article className="border-b border-zinc-200 bg-white text-left">
      {/* ── Post header ── */}
      <div className="flex items-center justify-between px-4 py-3 md:px-3">
        <div className="flex items-center gap-2.5">
          {/* Story-ring avatar */}
          <div className="relative">
            <StoryRing>
              <Avatar className="size-9">
                <AvatarImage src={post.avatarUrl} alt={post.username} />
                <AvatarFallback className="text-[10px]">
                  {post.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </StoryRing>
          </div>

          <div className="flex flex-col justify-start">
            <p className="text-[17px] font-semibold leading-tight cursor-pointer pb-[6px]">
              {post.username}
            </p>
            {post.location && (
              <p
                className="text-[12px] leading-tight text-zinc-500 al"
                style={{ textAlign: "start" }}
              >
                {post.location}
              </p>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Post options"
          className="cursor-pointer rounded-full text-zinc-700 hover:bg-transparent"
        >
          <MoreHorizontal className="size-5" strokeWidth={1.8} />
        </Button>
      </div>

      {/* ── Post image (responsive + double-tap) ── */}
      <div
        className="relative w-full overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        {/* Caption */}
        <p className="text-left leading-snug p-2 pt-1">
          <span className="text-[18px] text-zinc-900">{post.caption}</span>
        </p>
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="max-h-[400px] w-full object-fill select-none"
          // style={{ aspectRatio: "1 / 1" }}
          draggable={false}
        />
      </div>

      {/* ── Actions ── */}
      <div className="px-4 pb-1 pt-3 md:px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Like */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onToggleLike(post.id)}
              aria-label={post.isLiked ? "Unlike" : "Like"}
              className="h-auto min-h-0 w-auto cursor-pointer rounded-full bg-transparent p-0.5 text-inherit hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent dark:hover:bg-transparent active:translate-y-0"
            >
              <Heart
                className={
                  post.isLiked
                    ? "size-7 fill-red-500 stroke-red-500"
                    : "size-7 stroke-zinc-900"
                }
                strokeWidth={1.8}
              />
            </Button>

            {/* Comment — toggles comments list */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleCommentsPanel}
              aria-expanded={hasComments ? commentsVisible : undefined}
              aria-label={
                hasComments
                  ? commentsVisible
                    ? "Hide comments"
                    : `Show comments, ${comments.length} total`
                  : "Comment"
              }
              className="h-auto min-h-0 w-auto cursor-pointer rounded-full bg-transparent p-0.5 text-inherit hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent dark:hover:bg-transparent active:translate-y-0"
            >
              <MessageCircle className={"size-7"} strokeWidth={1.8} />
            </Button>

            {/* Share */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Share"
              className="h-auto min-h-0 w-auto cursor-pointer rounded-full bg-transparent p-0.5 text-inherit hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent dark:hover:bg-transparent active:translate-y-0"
            >
              <Send
                className="size-6.5 -rotate-12 stroke-zinc-900 mt-1"
                strokeWidth={1.8}
              />
            </Button>
          </div>

          {/* Save */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onToggleSave(post.id)}
            aria-label={post.isSaved ? "Unsave" : "Save"}
            className="h-auto min-h-0 w-auto cursor-pointer rounded-full bg-transparent p-0.5 text-inherit hover:bg-transparent hover:text-inherit aria-expanded:bg-transparent dark:hover:bg-transparent active:translate-y-0"
          >
            <Bookmark
              className={
                post.isSaved
                  ? "size-6.5 fill-zinc-900 stroke-zinc-900"
                  : "size-6.5 stroke-zinc-900"
              }
              strokeWidth={1.8}
            />
          </Button>
        </div>

        {/* Likes count */}
        <p className="mt-2 text-left text-[13.5px] font-semibold">
          {post.likesCount.toLocaleString()} likes
        </p>

        {/* Comments — ShadCN Card (no List primitive in shadcn/ui) */}
        {hasComments && commentsVisible ? (
          <Card
            size="sm"
            className="mt-3 w-full max-w-full text-left shadow-none ring-1 ring-zinc-200/90 bg-zinc-50/40 py-3 dark:bg-zinc-950/30 dark:ring-zinc-800"
          >
            <CardHeader className="px-4 pb-2 pt-0">
              <CardTitle className="text-left text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0">
              <CommentTree
                comments={comments}
                parentId={null}
                depth={0}
                onReply={setReplyTo}
              />
            </CardContent>
          </Card>
        ) : null}

        {/* Add comment */}
        <div className="mt-2 border-t border-zinc-100 pt-2.5 text-left">
          {replyTo ? (
            <div className="mb-2 flex items-center justify-between gap-2 text-left text-[12px] text-zinc-500">
              <span>
                Replying to{" "}
                <span className="font-semibold text-zinc-700">
                  {replyTo.username}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                className="h-auto min-h-0 p-0 text-[12px] font-normal text-zinc-500 hover:bg-transparent hover:text-zinc-500 dark:hover:bg-transparent"
                onClick={() => setReplyTo(null)}
              >
                Cancel
              </Button>
            </div>
          ) : null}
          <div className="flex min-h-10 items-center gap-1 rounded-full border border-zinc-200/90 bg-white px-1 pl-3 dark:border-zinc-800 dark:bg-zinc-950">
            <Input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePostComment();
              }}
              placeholder={
                replyTo ? `Reply to ${replyTo.username}…` : "Add a comment…"
              }
              aria-label="Write a comment"
              className="h-9 min-h-0 flex-1 border-0 bg-transparent px-0 py-2 text-[13.5px] text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:ring-0 md:text-[13.5px] dark:bg-transparent"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Emoji"
              className="size-8 shrink-0 rounded-full text-zinc-400 hover:bg-transparent hover:text-zinc-400 dark:hover:bg-transparent"
            >
              <Smile className="size-4.5" strokeWidth={1.8} />
            </Button>
            {commentInput.trim() ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handlePostComment}
                className="h-8 shrink-0 rounded-full px-3 text-[13px] font-semibold text-[#0095f6] hover:bg-transparent hover:text-[#0095f6] dark:hover:bg-transparent"
              >
                Post
              </Button>
            ) : null}
          </div>
        </div>

        {/* Timestamp */}
        <p className="mt-1 pb-3 text-left text-[11px] uppercase tracking-wide text-zinc-400">
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
        className="mx-auto w-full text-left"
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
