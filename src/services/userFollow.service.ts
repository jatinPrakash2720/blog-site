import { apiClient } from "../lib/apiConfig.ts";
import type { User, FollowToggleResponse } from "../types/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";

export const toggleFollow = (userIdToFollow: string) => {
  return apiClient.post<ApiResponse<FollowToggleResponse>>(
    `/follow/toggle/${userIdToFollow}`
  );
};

export const getUserFollowers = (userId: string) => {
  return apiClient.get<ApiResponse<User[]>>(
    `/follow/followers/${userId}`
  );
};

export const getUserFollowing = (userId: string) => {
  return apiClient.get<ApiResponse<User[]>>(
    `/follow/following/${userId}`
  );
};
