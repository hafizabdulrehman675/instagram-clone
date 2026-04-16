import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/redux/uiSlice";
import authReducer from "@/features/auth/redux/authSlice";
import usersReducer from "@/features/users/redux/usersSlice";
import postsReducer from "@/features/posts/redux/postsSlice";
import socialReducer from "@/features/social/redux/socialSlice";
import messagesReducer from "@/features/messages/redux/messagesSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    social: socialReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
