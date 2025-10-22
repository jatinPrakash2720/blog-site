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
import type {
  ChangePasswordData,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterData,
  ResetPasswordPayload,
  SignUpData,
  User,
  VerifyUserPayload,
} from "../types/api.ts";

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
  const [viewedProfile, setViewedProfile] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const clearAuthState = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    LocalStorage.remove("token");
    LocalStorage.remove("user");
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<boolean> => {
    let success = false;
    await requestHandler(
      () => userService.getCurrentUser(),
      null,
      (response) => {
        const user = response.data;
        setCurrentUser(user);
        setIsAuthenticated(true);
        LocalStorage.set("user", user);
        success = true;
      },
      () => {
        clearAuthState();
        success = false;
      }
    );
    return success;
  }, [clearAuthState]);

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Check for the special Google callback URL FIRST.
      if (
        location.pathname === "/auth/google/callback" ||
        location.pathname === "/auth/github/callback"
      ) {
        // Make a direct API call to get user + token data
        await requestHandler(
          () => userService.getCurrentUser(),
          null,
          (response) => {
            const user = response.data;
            // Extract token from cookies and save to localStorage
            const tokenFromCookie = document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1];

            // Extract token from URL params instead of cookies
            const urlParams = new URLSearchParams(location.search);
            const tokenFromUrl = urlParams.get("token");

            if (tokenFromUrl) {
              LocalStorage.set("token", tokenFromUrl);
            }

            if (tokenFromCookie) {
              LocalStorage.set("token", tokenFromCookie);
            }

            setCurrentUser(user);
            setIsAuthenticated(true);
            LocalStorage.set("user", user);
            navigate("/home");
          },
          () => {
            navigate("/auth/login");
          }
        );
      } else {
        // 2. For ALL other page loads, restore from localStorage
        const userFromStorage = LocalStorage.get("user") as User;
        const token = LocalStorage.get("token");
        console.log("here1");

        if (userFromStorage && token) {
          // Restore user state from localStorage
          setCurrentUser(userFromStorage);
          setIsAuthenticated(true);
          console.log("here2");

          // Optional: Validate token in background (don't block UI)
          fetchCurrentUser().catch((error) => {
            console.error("Background token validation failed:", error);
            // Only clear auth if it's definitely an auth error
            if (
              error.response?.status === 401 ||
              error.response?.status === 403
            ) {
              clearAuthState();
            }
          });
        }
      }
      // 3. Mark auth as ready only after the check is complete.
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
      await requestHandler(
        () => userService.signUpUser(userData),
        setLoading,
        (response) => {
          const email = response.data.email;
          navigate("/auth/verify-otp", { state: { email: email } });
        },
        setError
      );
    },
    [navigate]
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await requestHandler(
        () => userService.loginUser(credentials),
        setLoading,
        (response) => {
          const { user, accessToken } = response.data;
          setCurrentUser(user);
          setIsAuthenticated(true);
          LocalStorage.set("token", accessToken);
          LocalStorage.set("user", user);
          navigate("/home");
          // (response: { user: User; accessToken: string }) => {
          //   const { user, accessToken } = response;
          //   setCurrentUser(user);
          //   setIsAuthenticated(true);
          //   LocalStorage.set("token", accessToken);
          //   LocalStorage.set("user", user);
          //   navigate("/");
        },
        setError
      );
    },
    [navigate]
  );

  const register = useCallback(
    async (userData: RegisterData) => {
      await requestHandler(
        () => userService.registerUser(userData),
        setLoading,
        (response) => {
          // console.log(response);
          // console.log(response.data);
          const newUser = response.data;
          navigate("/auth/profile-setup", { state: { userId: newUser._id } });
          console.log("here");
        },
        setError
      );
    },
    [navigate]
  );

  const completeProfileSetup = useCallback(
    async (userId: string, imageData: FormData) => {
      await requestHandler(
        () => userService.updateProfileImages(userId, imageData),
        setLoading,
        () => {
          navigate("/auth/login");
        },
        setError
      );
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    await requestHandler(
      () => userService.logoutUser(),
      setLoading,
      () => {
        clearAuthState(); // This now correctly clears localStorage
        navigate("/auth/login");
      },
      (error) => {
        // Even if the API call fails, clear the frontend state
        clearAuthState();
        navigate("/auth/login");
        setError(error);
      }
    );
  }, [navigate, clearAuthState]);

  const refreshAuthToken = useCallback(async () => {
    await requestHandler(
      () => userService.refreshAccessToken(),
      setLoading,
      (response) => {
        const { data } = response.data;
        LocalStorage.set("token", data.accessToken);
        fetchCurrentUser();
      },
      (error) => {
        setError(error);
        clearAuthState();
        navigate("/auth/login");
      }
    );
  }, [navigate, clearAuthState, fetchCurrentUser]);

  const changePassword = useCallback(
    async (passwordData: ChangePasswordData) => {
      await requestHandler(
        () => userService.changeCurrentPassword(passwordData),
        setLoading,
        () => {},
        setError
      );
    },
    []
  );

  const updateProfile = useCallback(
    async (updateData: FormData | { fullName?: string; email?: string }) => {
      const getApiCall = () => {
        if (updateData instanceof FormData) {
          if (updateData.has("avatar"))
            return () => userService.updateUserAvatar(updateData);
          if (updateData.has("coverImage"))
            return () => userService.updateUserCoverImage(updateData);
        } else {
          if (updateData.fullName)
            return () =>
              userService.updateUserFullName({
                fullName: updateData.fullName!,
              });
          if (updateData.email)
            return () =>
              userService.updateUserEmail({ email: updateData.email! });
        }
        throw new Error("Invalid update data provided.");
      };
      await requestHandler(
        getApiCall() as () => Promise<any>,
        setLoading,
        (response: User | {}) => {
          if (response && "_id" in response) {
            const updatedUser = response as User;
            setCurrentUser(updatedUser);
            LocalStorage.set("user", updatedUser);
          } else {
            fetchCurrentUser();
          }
        },
        setError
      );
    },
    [fetchCurrentUser]
  );

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    let success = false;
    await requestHandler(
      () => userService.forgotPassword(payload),
      setLoading,
      () => {
        success = true;
      },
      setError
    );
    return success;
  }, []);

  const restorePassword = useCallback(
    async (token: string, payload: ResetPasswordPayload) => {
      let success = false;
      await requestHandler(
        () => userService.restorePassword(token, payload),
        setLoading,
        () => {
          success = true;
          navigate("/auth/login");
        },
        setError
      );
      return success;
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
        // The requestHandler gives us the full API response
        setViewedProfile(response.data);
      },
      setError
    );
  }, []);

  const verifyUser = useCallback(
    async (payload: VerifyUserPayload) => {
      await requestHandler(
        () => userService.verifyUser(payload),
        setLoading,
        (response) => {
          const { user, accessToken, refreshToken } = response.data;
          setCurrentUser(user);
          setIsAuthenticated(true);
          LocalStorage.set("token", accessToken);
          LocalStorage.set("user", user);
          LocalStorage.set("refreshToken", refreshToken);
          navigate("/home");
        },
        setError
      );
    },
    [navigate]
  );

  const contextValue: IAuthContext = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    isAuthReady,
    viewedProfile,
    login,
    register,
    verifyUser,
    completeProfileSetup,
    logout,
    refreshAuthToken,
    changePassword,
    updateProfile,
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
