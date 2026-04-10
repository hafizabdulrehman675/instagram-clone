import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FeedPost, PostComment } from "@/features/posts/types";

type PostsState = {
  postsById: Record<string, FeedPost>;
  feedPostIds: string[];
};

const p1Comments: PostComment[] = [
  {
    id: "p1c1",
    parentId: null,
    username: "emma_w",
    avatarUrl: "https://i.pravatar.cc/100?u=emma",
    text: "This is unreal — where was this taken?",
    postedAtLabel: "2h",
  },
  {
    id: "p1c2",
    parentId: "p1c1",
    username: "john_doe",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    text: "Clifton beach, right before sunset.",
    postedAtLabel: "1h",
  },
  {
    id: "p1c3",
    parentId: "p1c2",
    username: "emma_w",
    avatarUrl: "https://i.pravatar.cc/100?u=emma",
    text: "Need to go there soon.",
    postedAtLabel: "45m",
  },
  {
    id: "p1c4",
    parentId: null,
    username: "zain.dev",
    avatarUrl: "https://i.pravatar.cc/100?u=zain",
    text: "Colors are perfect.",
    postedAtLabel: "30m",
  },
  {
    id: "p1c5",
    parentId: "p1c4",
    username: "sara",
    avatarUrl: "https://i.pravatar.cc/100?u=sara",
    text: "Agreed.",
    postedAtLabel: "20m",
  },
];

const initialPosts: FeedPost[] = [
  {
    id: "p1",
    username: "john_doe",
    location: "Karachi, PK",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    imageUrl: "https://picsum.photos/700?random=1",
    likesCount: 1284,
    caption: "Golden hour never misses.",
    commentsCount: p1Comments.length,
    comments: p1Comments,
    postedAtLabel: "2 HOURS AGO",
    isLiked: false,
    isSaved: false,
  },
];

function normalizePosts(posts: FeedPost[]): PostsState {
  const postsById: Record<string, FeedPost> = {};
  const feedPostIds: string[] = [];

  for (const post of posts) {
    postsById[post.id] = post;
    feedPostIds.push(post.id);
  }

  return { postsById, feedPostIds };
}

const initialState: PostsState = normalizePosts(initialPosts);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost(state, action: PayloadAction<FeedPost>) {
      const post = action.payload;
      state.postsById[post.id] = post;
      state.feedPostIds.unshift(post.id);
    },
    toggleLike(state, action: PayloadAction<{ postId: string }>) {
      const post = state.postsById[action.payload.postId];
      if (!post) return;
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
    },
    toggleSave(state, action: PayloadAction<{ postId: string }>) {
      const post = state.postsById[action.payload.postId];
      if (!post) return;
      post.isSaved = !post.isSaved;
    },
    addComment(
      state,
      action: PayloadAction<{
        postId: string;
        text: string;
        parentId: string | null;
        username: string;
        avatarUrl: string;
      }>,
    ) {
      const post = state.postsById[action.payload.postId];
      if (!post) return;
      const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      post.comments.push({
        id,
        parentId: action.payload.parentId,
        username: action.payload.username,
        avatarUrl: action.payload.avatarUrl,
        text: action.payload.text.trim(),
        postedAtLabel: "JUST NOW",
      });
      post.commentsCount = post.comments.length;
    },
  },
});

export const { addPost, toggleLike, toggleSave, addComment } = postsSlice.actions;
export default postsSlice.reducer;
