import axios from "axios";
import { LocalStorage } from "./LocalStorage.ts";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "/api/v1",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = LocalStorage.get("token");
    // Only add the Authorization header if a token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add refresh token header for automatic token refresh
    const refreshToken = LocalStorage.get("refreshToken");
    if (refreshToken) {
      config.headers["X-Refresh-Token"] = refreshToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and update localStorage
apiClient.interceptors.response.use(
  (response) => {
    // Check if new tokens were set by the middleware (from automatic refresh)
    const newAccessToken = response.headers["x-new-access-token"];
    const newRefreshToken = response.headers["x-new-refresh-token"];

    // Update localStorage with new tokens if they were refreshed
    if (newAccessToken) {
      LocalStorage.set("token", newAccessToken);
      console.log("✅ Access token refreshed and updated in localStorage");
    }
    if (newRefreshToken) {
      LocalStorage.set("refreshToken", newRefreshToken);
      console.log("✅ Refresh token refreshed and updated in localStorage");
    }

    // Also check if tokens are in response body (from manual refresh endpoint)
    if (response.data?.data?.accessToken || response.data?.data?.refreshToken) {
      const { accessToken, refreshToken } = response.data.data;
      if (accessToken) {
        LocalStorage.set("token", accessToken);
      }
      if (refreshToken) {
        LocalStorage.set("refreshToken", refreshToken);
      }
    }

    return response;
  },
  (error) => {
    // If 401 error and we have refresh token, the middleware should handle it
    // If refresh fails, the error will propagate normally
    return Promise.reject(error);
  }
);

export { apiClient };
