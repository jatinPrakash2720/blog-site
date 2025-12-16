import { apiClient } from "../lib/apiConfig.ts";
import type * as apiInterfaces from "../types/apisInterfaces/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";
import type {
  LoginData,
  SignUpData,
  VerifyUserData,
  ChangePasswordData,
  UpdateUserFullNameData,
  UpdateUserEmailData,
  UpdateUserAvatarData,
  UpdateUserCoverImageData,
  PaginationParams,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/types/apisInterfaces/user.api.ts";
import type { User, UserPageProfile } from "@/types/modalsInterfaces/User.ts";
import type { PaginatedBlogResponse } from "@/types/apisInterfaces/blog.api.ts";

export const signUpUser = (data: SignUpData) => {
  return apiClient.post<ApiResponse<{ email: string }>>("/users/signup", data);
};

export const uniqueUsername = (username: string) => {
  return apiClient.post<ApiResponse<{success: boolean, message: string}>>("/users/unique-username", {username});
};

export const resendVerifyCode = (email: string) => {
  return apiClient.post<ApiResponse<{success: boolean, message: string}>>("/users/resend-verify-code", {email});
};
export const verifyUser = (data: VerifyUserData) => {
  return apiClient.post<
    ApiResponse<{
      user: User;
      accessToken?: string;
      refreshToken?: string;
    }>
  >("/users/verify", data);
};

export const updateProfileImages = (userId: string, imageData: FormData) => {
  return apiClient.patch(`/users/${userId}/profile-images`, imageData);
};

export const loginUser = (data: LoginData) => {
  return apiClient.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
    "/users/login",
    data
  );
};

export const logoutUser = () => {
  return apiClient.get("/users/logout");
};

export const refreshAccessToken = () => {
  return apiClient.post<ApiResponse<{ accessToken: string }>>(
    "/users/refresh-token"
  );
};

export const changeCurrentPassword = (data: ChangePasswordData) => {
  return apiClient.post("/users/change-password", data);
};

export const getCurrentUser = () => {
  return apiClient.get<ApiResponse<User>>("/users/current-user");
};

export const updateUserFullName = (data: UpdateUserFullNameData) => {
  return apiClient.patch<ApiResponse<{fullName: string}>>("/users/update-fullname", data);
};

export const updateUserEmail = (data: UpdateUserEmailData) => {
  return apiClient.patch<ApiResponse<{email: string}>>("/users/update-email", data);
};

export const updateUserAvatar = (data: UpdateUserAvatarData) => {
  return apiClient.patch<ApiResponse<{avatarUrl: string}>>("/users/update-avatar", data);
};

export const updateUserCoverImage = (data: UpdateUserCoverImageData) => {
  return apiClient.patch<ApiResponse<{coverImageUrl: string}>>("/users/update-cover", data);
};

export const getUserPageProfile = (username: string) => {
  return apiClient.get<ApiResponse<UserPageProfile>>(`/users/c/${username}`);
};

export const getReadHistory = (params: PaginationParams) => {
  return apiClient.get<ApiResponse<PaginatedBlogResponse>>("/users/history", {
    params,
  });
};

export const getUserBlogs = ({
  userId,
  ...params
}: apiInterfaces.GetUserBlogsParams) => {
  return apiClient.get<ApiResponse<PaginatedBlogResponse>>(
    `/users/${userId}/blogs`,
    {
      params,
    }
  );
};

export const forgotPassword = (data: ForgotPasswordData) => {
  return apiClient.post<ApiResponse<{success: boolean, message: string}>>("/users/forgot-password", data);
};

export const restorePassword = (token: string, data: ResetPasswordData) => {
  return apiClient.post<ApiResponse<{success: boolean, message: string}>>(`/users/restore-password/${token}`, data);
};
