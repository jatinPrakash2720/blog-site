import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import { LocalStorage } from "./LocalStorage.ts";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "/api/v1",
  withCredentials: true,
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: Add access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = LocalStorage.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors and automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Update tokens from response headers (if middleware refreshed them)
    const newAccessToken = response.headers["x-new-access-token"];
    const newRefreshToken = response.headers["x-new-refresh-token"];

    if (newAccessToken) {
      LocalStorage.set("accessToken", newAccessToken);
    }
    if (newRefreshToken) {
      LocalStorage.set("refreshToken", newRefreshToken);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    // Only handle 401 errors and avoid infinite loops
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = LocalStorage.get("refreshToken");

      // If no refresh token, clear auth and reject
      if (!refreshToken) {
        LocalStorage.remove("accessToken");
        LocalStorage.remove("refreshToken");
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URI || "/api/v1"}/users/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              "X-Refresh-Token": refreshToken,
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data?.data || {};

        if (accessToken) {
          LocalStorage.set("accessToken", accessToken);
          if (newRefreshToken) {
            LocalStorage.set("refreshToken", newRefreshToken);
          }

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Process queued requests
          processQueue(null, accessToken);
          isRefreshing = false;

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        LocalStorage.remove("accessToken");
        LocalStorage.remove("refreshToken");
        processQueue(refreshError, null);
        isRefreshing = false;

        // Redirect to login if not already there
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // For non-401 errors, just reject normally
    return Promise.reject(error);
  }
);

export { apiClient };
