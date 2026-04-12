import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/redux/uiSlice";
import authReducer from "@/features/auth/redux/authSlice";
import usersReducer from "@/features/users/redux/usersSlice";
import postsReducer from "@/features/posts/redux/postsSlice";
import socialReducer from "@/features/social/redux/socialSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    social: socialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
