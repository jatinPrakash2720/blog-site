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
    if ([401, 403].includes(axiosError.response?.data?.statusCode || 0)) {
      // Handle unauthorized access, e.g., redirect to login
      localStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }
    return onError({
      message: axiosError.response?.data?.message || "Something went wrong",
      success: false,
      statusCode: axiosError.response?.data?.statusCode || 0,
    });
  } finally {
    setLoading?.(false);
  }
};
