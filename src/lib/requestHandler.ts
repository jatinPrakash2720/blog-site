import type { AxiosResponse } from "axios";
import { isBrowser } from "./index"; // Assuming index.ts exists
import type { ApiResponse } from "../types/apiResponse.ts";
import type { AxiosErrorResponse } from "../types/apiError.ts";

export const requestHandler = async <T>(
  api: () => Promise<AxiosResponse<ApiResponse<T>>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: ApiResponse<T>) => any, // Now returns the inner 'data' directly
  onError: (data: ApiResponse<T>) => any
) => {
  setLoading?.(true);
  try {
    const response = await api();
    const { data } = response;
    console.log("response data :", data);
    console.log("response success :", response?.data?.success);
    if (response?.data?.success) {
      return onSuccess(data); // Pass the nested data directly to the success callback
    } else {
      return onError(data); // Set success to false if API returns success: false
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    
    // Token refresh is handled automatically by the interceptor
    // Only handle definitive auth failures here
    const statusCode = axiosError.response?.data?.statusCode || 0;
    const errorMessage = axiosError.response?.data?.message || "";
    
    // Only clear auth if refresh token is definitively expired/invalid
    if ([401, 403].includes(statusCode)) {
      const isRefreshFailed =
        errorMessage.includes("Refresh Token Expired") ||
        errorMessage.includes("Refresh Token Invalid");
      
      if (isRefreshFailed && isBrowser) {
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
    
    return onError({
      message: errorMessage || "Something went wrong",
      success: false,
      statusCode,
    });
  } finally {
    setLoading?.(false);
  }
};
