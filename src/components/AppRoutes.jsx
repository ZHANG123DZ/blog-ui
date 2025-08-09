import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import AppLayout from "../layouts/AppLayout/AppLayout";
import FullscreenLayout from "../layouts/FullscreenLayout/FullscreenLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Loading from "./Loading/Loading";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { getCurrentUser } from "@/features/auth/authAsync";
import { useDispatch } from "react-redux";
import VerifyEmail from "@/pages/VerifyEmail";
import { settingHandle } from "@/features/auth/settingAsync";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import socketClient from "@/configs/socketClient";
import { usePresenceChannel } from "@/stores/usePresenceChannel";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home/Home"));
const Topic = lazy(() => import("../pages/Topic/Topic"));
const TopicsListing = lazy(() =>
  import("../pages/TopicsListing/TopicsListing")
);
const BlogDetail = lazy(() => import("../pages/BlogDetail/BlogDetail"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const EditProfile = lazy(() => import("../pages/EditProfile/EditProfile"));
const MyPosts = lazy(() => import("../pages/MyPosts/MyPosts"));
const WritePost = lazy(() => import("../pages/WritePost/WritePost"));
const Bookmarks = lazy(() => import("../pages/Bookmarks/Bookmarks"));
const DirectMessages = lazy(() =>
  import("../pages/DirectMessages/DirectMessages")
);
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const ForgotPassword = lazy(() =>
  import("../pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("../pages/ResetPassword/ResetPassword")
);
const Follower = lazy(() => import("../pages/Follower/Follower"));
const Following = lazy(() => import("../pages/Following/Following"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(settingHandle());
  }, [dispatch]);

  usePresenceChannel();

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading fullscreen />}>
        <Routes>
          {/* App Layout Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="topics" element={<TopicsListing />} />
            <Route path="topics/:slug" element={<Topic />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route
              path="profile/:username/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-posts"
              element={
                <ProtectedRoute>
                  <MyPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="profile/:username/following" element={<Following />} />
            <Route path="profile/:username/follower" element={<Follower />} />
          </Route>

          {/* Fullscreen Layout Routes */}
          <Route path="/" element={<FullscreenLayout />}>
            <Route
              path="write"
              element={
                <ProtectedRoute>
                  <WritePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="write/:slug"
              element={
                <ProtectedRoute>
                  <WritePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute>
                  <DirectMessages />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            }
          />

          <Route
            path="/verify-email"
            element={
              <AuthLayout>
                <VerifyEmail />
              </AuthLayout>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
