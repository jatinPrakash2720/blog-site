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
    LocalStorage.remove("user");
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    await requestHandler(
      () => userService.getCurrentUser(),
      null,
      (response) => {
        if (!response.data)
          return { success: false, message: "Refresh Again Please" };
        setCurrentUser(response.data);
        setIsAuthenticated(true);
        LocalStorage.set("user", response.data);
        return response;
      },
      (response) => {
        if (!response.data)
          return { success: false, message: "Refresh Again Please" };
        clearAuthState();
        navigate("/auth/login");
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
            // Extract token from cookies and save to localStorage
            const tokenFromCookie = document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1];

            // Extract token from URL params instead of cookies
            const urlParams = new URLSearchParams(location.search);
            const tokenFromUrl = urlParams.get("token");

            console.log("🔑 [Auth] Token extraction:", {
              tokenFromCookie: !!tokenFromCookie,
              tokenFromUrl: !!tokenFromUrl,
              cookieLength: tokenFromCookie?.length || 0,
              urlTokenLength: tokenFromUrl?.length || 0,
            });

            if (tokenFromUrl) {
              LocalStorage.set("token", tokenFromUrl);
              console.log("💾 [Auth] Token saved from URL params");
            }

            if (tokenFromCookie) {
              LocalStorage.set("token", tokenFromCookie);
              console.log("💾 [Auth] Token saved from cookies");
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
        const userFromStorage = LocalStorage.get("user") as User;
        const token = LocalStorage.get("token");

        console.log("🔍 [Auth] LocalStorage check:", {
          hasUser: !!userFromStorage,
          hasToken: !!token,
          tokenLength: token?.length || 0,
          userId: userFromStorage?._id,
          username: userFromStorage?.username,
        });

        if (userFromStorage && token) {
          console.log("✅ [Auth] Valid credentials found, restoring session");

          // Restore user state from localStorage
          setCurrentUser(userFromStorage);
          setIsAuthenticated(true);

          console.log("🔄 [Auth] Starting background token validation...");

          // Optional: Validate token in background (don't block UI)
          fetchCurrentUser().catch((error) => {
            console.error("⚠️ [Auth] Background token validation failed:", {
              error: error.message,
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
            });

            // Only clear auth if it's definitely an auth error
            if (
              error.response?.status === 401 ||
              error.response?.status === 403
            ) {
              console.log(
                "🚫 [Auth] Token invalid (401/403), clearing auth state"
              );
              clearAuthState();
            } else {
              console.log("ℹ️ [Auth] Non-auth error, keeping session active");
            }
          });
        } else {
          console.log(
            "❌ [Auth] No valid credentials found, user not authenticated"
          );
        }
      }

      // 3. Mark auth as ready only after the check is complete.
      console.log("🏁 [Auth] Authentication initialization complete");
      setIsAuthReady(true);
    };

    initializeAuth();
  }, []);

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
            return { success: false, message: "No sign up data found", data: null };
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
            LocalStorage.set("token", accessToken);
            LocalStorage.set("user", user);
            LocalStorage.set("refreshToken", refreshToken);
          } else {
            LocalStorage.set("token", "");
            LocalStorage.set("user", "");
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
      data?: { user: User; accessToken: string };
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
          const { user, accessToken } = response.data;
          setCurrentUser(user);
          setIsAuthenticated(true);
          if (credentials.saveLogin) {
            LocalStorage.set("token", accessToken);
            LocalStorage.set("user", user);
          } else {
            LocalStorage.set("token", "");
            LocalStorage.set("user", "");
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
    return await requestHandler(
      () => userService.logoutUser(),
      setLoading,
      (response) => {
        if (!response.data)
          return { success: false, message: "No logout data found" };
        clearAuthState();
        navigate("/auth/login");
        return response;
      },
      (response) => {
        if (!response.data)
          return { success: false, message: "No logout data found" };
        clearAuthState();
        navigate("/auth/login");
        return response;
      }
    );
  }, [navigate, clearAuthState]);

  const refreshAuthToken = useCallback(async () => {
    return await requestHandler(
      () => userService.refreshAccessToken(),
      setLoading,
      (response) => {
        if (!response.data) return { success: false, message: "No data found" };
        const { accessToken } = response.data;
        LocalStorage.set("token", accessToken);
        fetchCurrentUser();
      },
      (response) => {
        if (!response.data) return { success: false, message: "No data found" };
        clearAuthState();
        navigate("/auth/login");
        return response;
      }
    );
  }, [navigate, clearAuthState, fetchCurrentUser]);

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
    refreshAuthToken,
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
