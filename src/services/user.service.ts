import { apiClient } from "../lib/apiConfig.ts";
import type * as apiInterfaces from "../types/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";

export const registerUser = (data: apiInterfaces.RegisterData) => {
  return apiClient.post<ApiResponse<apiInterfaces.User>>(
    "/users/register",
    data
  );
};

export const updateProfileImages = (userId: string, imageData: FormData) => {
  return apiClient.patch(`/users/${userId}/profile-images`, imageData);
};

export const loginUser = (data: apiInterfaces.LoginCredentials) => {
  return apiClient.post<
    ApiResponse<{ user: apiInterfaces.User; accessToken: string }>
  >("/users/login", data);
};

export const logoutUser = () => {
  return apiClient.get("/users/logout");
};

export const refreshAccessToken = () => {
  return apiClient.post<ApiResponse<{ data: { accessToken: string } }>>(
    "/users/refresh-token"
  );
};

export const changeCurrentPassword = (
  data: apiInterfaces.ChangePasswordData
) => {
  return apiClient.post("/users/change-password", data);
};

export const getCurrentUser = () => {
  return apiClient.get<ApiResponse<apiInterfaces.User>>("/users/current-user");
};

export const updateUserFullName = (data: { fullName: string }) => {
  return apiClient.patch("/users/update-fullname", data);
};

export const updateUserEmail = (data: { email: string }) => {
  return apiClient.patch("/users/update-email", data);
};

export const updateUserAvatar = (avatarFormData: FormData) => {
  return apiClient.patch("/users/update-avatar", avatarFormData);
};

export const updateUserCoverImage = (coverImageFormData: FormData) => {
  return apiClient.patch("/users/update-cover", coverImageFormData);
};

export const getUserPageProfile = (username: string) => {
  return apiClient.get<ApiResponse<apiInterfaces.User>>(`/users/c/${username}`);
};

export const getReadHistory = (params: apiInterfaces.PaginationParams = {}) => {
  return apiClient.get<ApiResponse<apiInterfaces.PaginatedBlogResponse>>(
    "/users/history",
    {
      params,
    }
  );
};

export const getUserBlogs = ({
  userId,
  ...params
}: apiInterfaces.GetUserBlogsParams) => {
  return apiClient.get<ApiResponse<apiInterfaces.PaginatedBlogResponse>>(
    `/users/${userId}/blogs`,
    {
      params,
    }
  );
};

export const forgotPassword = (data: apiInterfaces.ForgotPasswordPayload) => {
  return apiClient.post("/users/forgot-password", data);
};

export const restorePassword = (
  token: string,
  data: apiInterfaces.ResetPasswordPayload
) => {
  return apiClient.post(`/users/restore-password/${token}`, data);
};
