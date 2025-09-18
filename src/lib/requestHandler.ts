import type { AxiosResponse } from "axios";
import { isBrowser } from "./index"; // Assuming index.ts exists
import type { ApiResponse } from "../types/apiResponse.ts";
import type { AxiosErrorResponse } from "../types/apiError.ts";

export const requestHandler = async <T>(
  api: () => Promise<AxiosResponse<ApiResponse<T>>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: ApiResponse<T>) => void, // Now returns the inner 'data' directly
  onError: (error: string) => void
) => {
  setLoading?.(true);
  try {
    const response = await api();
    const { data } = response;
    if (data?.success) {
      onSuccess(data); // Pass the nested data directly to the success callback
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse;
    if ([401, 403].includes(axiosError.response?.data?.statusCode || 0)) {
      // Handle unauthorized access, e.g., redirect to login
      localStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }
    onError(axiosError.response?.data?.message || "Something went wrong");
  } finally {
    setLoading?.(false);
  }
};
