import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/redux/uiSlice";
import authReducer from "@/features/auth/redux/authSlice";
import usersReducer from "@/features/users/redux/usersSlice";
import postsReducer from "@/features/posts/redux/postsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
