import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FeedPost } from "@/features/posts/types";

type PostsState = {
  postsById: Record<string, FeedPost>;
  feedPostIds: string[];
};

const initialPosts: FeedPost[] = [
  {
    id: "p1",
    username: "john_doe",
    location: "Karachi, PK",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    imageUrl: "https://picsum.photos/700?random=1",
    likesCount: 1284,
    caption: "Golden hour never misses.",
    commentsCount: 24,
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
  },
});

export const { addPost, toggleLike, toggleSave } = postsSlice.actions;
export default postsSlice.reducer;
