import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "./components/layout/MainLayout";
import PublicRoute from "./components/features/route/PublicRoute";
import PrivateRoute from "./components/features/route/PrivateRoute";
import { EditorProvider } from "./store/editor";

// Lazy load HomePage for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
// import UserProfilePage from "./pages/UserProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import EditorPage from "./pages/EditorPage";
import AuthPage from "./pages/AuthPage";
import Loader from "./components/ui/Loader";
import LandingPage from "./pages/LandingPage";
import PreviewPage from "./pages/RepresentationPage";

function App() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <EditorProvider>
            <Routes>
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <Suspense fallback={<Loader />}>
                        <HomePage />
                      </Suspense>
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/preview/:blogId"
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <PreviewPage />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/editor"
                element={
                  <PrivateRoute>
                    <EditorPage isStandalone />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </EditorProvider>
        }
      />

      <Route
        path="/"
        element={
          <PublicRoute>
            <MainLayout>
              <LandingPage />
            </MainLayout>
          </PublicRoute>
        }
      >
        <Route
          path="auth/login"
          element={
            <PublicRoute>
              <AuthPage mode="login" />
            </PublicRoute>
          }
        />
        <Route
          path="auth/register"
          element={
            <PublicRoute>
              <AuthPage mode="register" />
            </PublicRoute>
          }
        />
        <Route
          path="auth/forgot-password"
          element={
            <PublicRoute>
              <AuthPage mode="forgot-password" />
            </PublicRoute>
          }
        />
        <Route
          path="auth/verify-otp"
          element={
            <PublicRoute>
              <AuthPage mode="verify-otp" />
            </PublicRoute>
          }
        />
        <Route
          path="auth/restore-password"
          element={
            <PublicRoute>
              <AuthPage mode="restore-password" />
            </PublicRoute>
          }
        />
        <Route
          path="auth/restore-password/:token"
          element={
            <PublicRoute>
              <AuthPage mode="restore-password" />
            </PublicRoute>
          }
        />
      </Route>

      <Route path="/auth/google/callback" element={<Loader />} />
      <Route path="/auth/github/callback" element={<Loader />} />
    </Routes>
  );
}

export default App;
