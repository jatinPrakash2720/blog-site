import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as userService from "../services/user.service.ts";
import Loader from "../components/ui/Loader.js";
import { LocalStorage, requestHandler } from "../lib/index.ts";
import type { IAuthContext, AuthProviderProps } from "../types/context.ts";
import type { User } from "../types/modalsInterfaces/User.ts";
import type {
  ForgotPasswordData,
  LoginData,
  ResetPasswordData,
  VerifyUserData,
  ChangePasswordData,
  SignUpData,
} from "@/types/apisInterfaces/user.api.ts";
import type { UserPageProfile } from "@/types/modalsInterfaces/User.ts";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UseAuth must be used within an AuthProvider.");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [viewedProfile, setViewedProfile] = useState<UserPageProfile | null>(
    null
  );

  const navigate = useNavigate();
  const location = useLocation();

  const clearAuthState = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    LocalStorage.remove("token");
    LocalStorage.remove("accessToken");
    LocalStorage.remove("refreshToken");
    LocalStorage.remove("user");
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    await requestHandler(
      () => userService.getCurrentUser(),
      null,
      (response) => {
        if (!response.data)
          return { success: false, message: "No user data found" };
        setCurrentUser(response.data);
        setIsAuthenticated(true);
        LocalStorage.set("user", response.data);
        return response;
      },
      (response) => {
        // If error occurs, the interceptor already handled token refresh
        // If refresh failed, user will be redirected to login by interceptor
        // Just clear local state here
        const errorMessage = response.message || "";
        const isRefreshFailed =
          errorMessage.includes("Refresh Token Expired") ||
          errorMessage.includes("Refresh Token Invalid");

        if (isRefreshFailed) {
          clearAuthState();
        }
        return response;
      }
    );
  }, [clearAuthState]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🚀 [Auth] Initializing authentication...");
      console.log("📍 [Auth] Current location:", {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      });

      // 1. Check for the special Google callback URL FIRST.
      if (
        location.pathname === "/auth/google/callback" ||
        location.pathname === "/auth/github/callback"
      ) {
        console.log("🔄 [Auth] OAuth callback detected:", location.pathname);

        // Make a direct API call to get user + token data
        await requestHandler(
          () => userService.getCurrentUser(),
          null,
          (response) => {
            console.log("✅ [Auth] OAuth callback success:", {
              hasUser: !!response.data,
              userId: response.data?._id,
              username: response.data?.username,
              email: response.data?.email,
            });

            const user = response.data;
            // Extract token from cookies (OAuth uses httpOnly: false, so accessible)
            // Note: May not work if backend and frontend are on different domains
            const tokenFromCookie = document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1];

            // Extract token from URL params as fallback
            const urlParams = new URLSearchParams(location.search);
            const tokenFromUrl = urlParams.get("accessToken");

            console.log("🔑 [Auth] Token extraction:", {
              tokenFromCookie: !!tokenFromCookie,
              tokenFromUrl: !!tokenFromUrl,
              cookieLength: tokenFromCookie?.length || 0,
              urlTokenLength: tokenFromUrl?.length || 0,
            });

            // Prioritize URL params (more reliable), fallback to cookies
            if (tokenFromUrl) {
              LocalStorage.set("accessToken", tokenFromUrl);
              console.log("💾 [Auth] Token saved from URL params");
            } else if (tokenFromCookie) {
              LocalStorage.set("accessToken", tokenFromCookie);
              console.log("💾 [Auth] Token saved from cookies");
            } else {
              console.warn("⚠️ [Auth] No token found in URL params or cookies");
            }

            setCurrentUser(user as User);
            setIsAuthenticated(true);
            LocalStorage.set("user", user);
            console.log(
              "🎉 [Auth] OAuth authentication complete, navigating to /home"
            );
            navigate("/home");
          },
          (response) => {
            console.error("❌ [Auth] OAuth callback failed:", {
              message: response.message,
              status: response.statusCode,
              data: response.data,
            });
            setError(response.message);
            navigate("/auth/login");
          }
        );
      } else {
        console.log("📦 [Auth] Regular page load - checking localStorage");

        // 2. For ALL other page loads, restore from localStorage
        const userFromStorage = LocalStorage.get("user");
        const accessToken = LocalStorage.get("accessToken");
        const refreshToken = LocalStorage.get("refreshToken");

        console.log("🔍 [Auth] LocalStorage check:", {
          hasUser: !!userFromStorage,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          accessTokenLength: accessToken?.length || 0,
          refreshTokenLength: refreshToken?.length || 0,
          userId: userFromStorage?._id,
          username: userFromStorage?.username,
        });

        // Simple check: if user exists in storage, restore session
        // Token refresh will be handled automatically by interceptor when needed
        if (userFromStorage && (accessToken || refreshToken)) {
          // Restore user state from localStorage
          setCurrentUser(userFromStorage);
          setIsAuthenticated(true);

          // Optionally validate token in background (non-blocking)
          fetchCurrentUser().catch(() => {
            // If validation fails, interceptor will handle refresh or redirect
            // No need for complex error handling here
          });
        } else {
          // No user or tokens found
          clearAuthState();
        }
      }

      // 3. Mark auth as ready only after the check is complete.
      console.log("🏁 [Auth] Authentication initialization complete");
      setIsAuthReady(true);
    };

    initializeAuth();
  }, [clearAuthState, navigate, fetchCurrentUser]);

  const continueWithGoogle = () => {
    console.log("Environment variables:");
    console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
    console.log("VITE_SERVER_URI:", import.meta.env.VITE_SERVER_URI);
    console.log("All env vars:", import.meta.env);

    // For OAuth, we need to redirect to the backend server, not through nginx proxy
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    // const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL;
    console.log("Final backend URL:", backendUrl);
    console.log("Redirecting to:", `${backendUrl}/api/v1/users/google`);
    window.location.href = `${backendUrl}/api/v1/users/google`;
  };

  const continueWithGithub = () => {
    // For OAuth, we need to redirect to the backend server, not through nginx proxy
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    window.location.href = `${backendUrl}/api/v1/users/github`;
  };
  const signUp = useCallback(
    async (userData: SignUpData) => {
      return await requestHandler(
        () => userService.signUpUser(userData),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No sign up data found",
              data: null,
            };
          navigate("/auth/verify-otp", {
            state: {
              email: response.data.email,
              saveLogin: userData.saveLogin,
            },
          });
          return response;
        },
        (response) => {
          if (!response.data)
            return { success: false, message: "No sign up data found" };
          return response;
        }
      );
    },
    [navigate]
  );
  const verifyUser = useCallback(
    async (payload: VerifyUserData) => {
      return await requestHandler(
        () => userService.verifyUser(payload),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: response.success || false,
              message: response.message,
              data: response.data,
            };
          const { user, accessToken, refreshToken } = response.data;
          if (payload.saveLogin) {
            LocalStorage.set("accessToken", accessToken);
            LocalStorage.set("user", user);
            LocalStorage.set("refreshToken", refreshToken);
          } else {
            LocalStorage.remove("accessToken");
            LocalStorage.remove("refreshToken");
            LocalStorage.remove("user");
          }
          setCurrentUser(user);
          setIsAuthenticated(true);

          navigate("/home");
          return response;
        },
        (response) => {
          return response;
        }
      );
    },
    [navigate]
  );

  const uniqueUsername = useCallback(
    async (username: string) => {
      return await requestHandler(
        () => userService.uniqueUsername(username),
        setLoading,
        (response) => {
          return response;
        },
        (response) => {
          return response;
        }
      );
    },
    [navigate]
  );

  const resendVerifyCode = useCallback(
    async (email: string) => {
      return await requestHandler(
        () => userService.resendVerifyCode(email),
        setLoading,
        (response) => {
          return response;
        },
        (response) => {
          return response;
        }
      );
    },
    [navigate]
  );

  const login = useCallback(
    async (
      credentials: LoginData
    ): Promise<{
      status: number;
      success: boolean;
      message?: string;
      data?: { user: User; accessToken: string; refreshToken: string };
    }> => {
      return await requestHandler(
        () => userService.loginUser(credentials),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No login data found",
            };
          const { user, accessToken, refreshToken } = response.data;
          setCurrentUser(user);
          setIsAuthenticated(true);
          if (credentials.saveLogin) {
            LocalStorage.set("accessToken", accessToken);
            LocalStorage.set("refreshToken", refreshToken);
            LocalStorage.set("user", user);
          } else {
            // Remove tokens instead of setting empty strings to avoid parsing issues
            LocalStorage.remove("accessToken");
            LocalStorage.remove("refreshToken");
            LocalStorage.remove("user");
          }
          console.log("response onSuccess :", response);
          navigate("/home");
          return response;
        },
        (response) => {
          console.log("response onError :", response);
          return response;
        }
      );
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    // Always clear auth state first to ensure localStorage is cleared
    clearAuthState();

    return await requestHandler(
      () => userService.logoutUser(),
      setLoading,
      (response) => {
        console.log("response onSuccess :", response);
        // Auth state already cleared, just navigate
        navigate("/auth/login");
        return response;
      },
      (response) => {
        console.log("response onError :", response);
        // Auth state already cleared, just navigate
        navigate("/auth/login");
        return response;
      }
    );
  }, [navigate, clearAuthState]);

  const changePassword = useCallback(
    async (passwordData: ChangePasswordData) => {
      await requestHandler(
        () => userService.changeCurrentPassword(passwordData),
        setLoading,
        (response) => {
          if (!response.data)
            return { success: false, message: "No data found" };
          return response;
        },
        (response) => {
          if (!response.data)
            return { success: false, message: "No data found" };
          return response;
        }
      );
    },
    []
  );

  const updateAvatar = useCallback(
    async (avatarData: FormData) => {
      await requestHandler(
        () => userService.updateUserAvatar({ avatarFormData: avatarData }),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating avatar",
            };
          setCurrentUser((prevUser) =>
            prevUser ? { ...prevUser, avatar: response.data?.avatarUrl } : null
          );
          LocalStorage.set("user", currentUser);
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating avatar",
            };
          return response;
        }
      );
    },
    [fetchCurrentUser]
  );

  const updateCoverImage = useCallback(
    async (coverImageData: FormData) => {
      await requestHandler(
        () =>
          userService.updateUserCoverImage({
            coverImageFormData: coverImageData,
          }),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating cover image",
            };
          setCurrentUser((prevUser) =>
            prevUser
              ? { ...prevUser, coverImage: response.data?.coverImageUrl }
              : null
          );
          LocalStorage.set("user", currentUser);
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating cover image",
            };
          return response;
        }
      );
    },
    [fetchCurrentUser]
  );

  const updateFullName = useCallback(
    async (fullName: string) => {
      await requestHandler(
        () => userService.updateUserFullName({ fullName }),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating full name",
            };
          setCurrentUser((prevUser) =>
            prevUser
              ? {
                  ...prevUser,
                  fullName: response.data?.fullName || prevUser.fullName,
                }
              : null
          );
          LocalStorage.set("user", currentUser);
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating full name",
            };
          return response;
        }
      );
    },
    [fetchCurrentUser]
  );

  const updateEmail = useCallback(
    async (email: string) => {
      await requestHandler(
        () => userService.updateUserEmail({ email }),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating email",
            };
          setCurrentUser((prevUser) =>
            prevUser
              ? { ...prevUser, email: response.data?.email || prevUser.email }
              : null
          );
          LocalStorage.set("user", currentUser);
          return response;
        },
        (response) => {
          if (!response.data)
            return {
              success: false,
              message: "No data found while updating email",
            };
          return response;
        }
      );
    },
    [fetchCurrentUser]
  );

  const forgotPassword = useCallback(
    async (
      payload: ForgotPasswordData
    ): Promise<{
      status: number;
      success: boolean;
      message?: string;
      data?: { success: boolean; message: string };
    }> => {
      return await requestHandler(
        () => userService.forgotPassword(payload),
        setLoading,
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No data found while sending forgot password email",
            };
          return {
            status: response.statusCode,
            success: response?.data?.success || response.success,
            message: response?.data?.message || response.message,
            data: response.data,
          };
        },
        (response) => {
          if (!response.data)
            return {
              status: response.statusCode,
              success: false,
              message: "No data found while sending forgot password email",
            };
          return {
            status: response.statusCode,
            success: response?.data?.success || false,
            message: response?.data?.message || response.message,
          };
        }
      );
    },
    []
  );

  const restorePassword = useCallback(
    async (
      token: string,
      payload: ResetPasswordData
    ): Promise<{ status: number; success: boolean; message?: string }> => {
      return await requestHandler(
        () => userService.restorePassword(token, payload),
        setLoading,
        (response) => {
          navigate("/auth/login");
          return response;
        },
        (response) => {
          navigate("/auth/forgot-password");
          return response;
        }
      );
    },
    [navigate]
  );

  const clearAuthError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUserProfile = useCallback(async (username: string) => {
    await requestHandler(
      () => userService.getUserPageProfile(username),
      setLoading,
      (response) => {
        if (!response.data)
          return {
            success: false,
            message: "No data found while fetching user profile",
          };
        setViewedProfile(response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return {
            success: false,
            message: "No data found while fetching user profile",
          };
        return response;
      }
    );
  }, []);

  const contextValue: IAuthContext = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    isAuthReady,
    viewedProfile,
    login,
    verifyUser,
    uniqueUsername,
    resendVerifyCode,
    logout,
    changePassword,
    updateAvatar,
    updateCoverImage,
    updateFullName,
    updateEmail,
    forgotPassword,
    restorePassword,
    clearAuthError,
    fetchCurrentUser,
    fetchUserProfile,
    continueWithGoogle,
    continueWithGithub,
    signUp,
  };

  if (!isAuthReady) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
