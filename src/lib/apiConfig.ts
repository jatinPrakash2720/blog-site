import axios from "axios";
import { LocalStorage } from "./LocalStorage.ts";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = LocalStorage.get("token");
    // Only add the Authorization header if a token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { apiClient };

