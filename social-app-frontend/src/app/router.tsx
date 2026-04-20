import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import AuthLayout from "@/layouts/AuthLayout";
import FeedPage from "@/pages/FeedPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignupPage from "@/pages/SignupPage";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import CreatePostPage from "@/pages/CreatePostPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProfilePage from "@/pages/EditProfilePage";
import ExplorePage from "@/pages/ExplorePage";
import NotificationsPage from "@/pages/NotificationsPage";
import MessagesPage from "@/pages/MessagesPage";
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            index: true,
            element: <FeedPage />,
          },
          { path: "profile/edit", element: <EditProfilePage /> },
          { path: "profile/:username", element: <ProfilePage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "create", element: <CreatePostPage /> },
          { path: "explore", element: <ExplorePage /> },
          { path: "notifications", element: <NotificationsPage /> },
          {
            path: "messages",
            element: <MessagesPage />,
            handle: { hideRightSidebar: true },
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
