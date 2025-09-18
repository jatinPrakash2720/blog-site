import { apiClient } from "../lib/apiConfig.ts";
import type {User, Blog, LikeToggleResponse } from "../types/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";

export const toggleBlogLike = (blogId: string) => {
  return apiClient.post<ApiResponse<LikeToggleResponse>>(
    `/likes/toggle/blog/${blogId}`
  );
};

export const toggleCommentLike = (commentId: string) => {
  return apiClient.post<ApiResponse<LikeToggleResponse>>(
    `/likes/toggle/comment/${commentId}`
  );
};

export const getBlogsLikedByUser = () => {
  return apiClient.get<ApiResponse<{ data: Blog[] }>>("/likes/blogs");
};

export const getBlogLikes = (blogId: string) => {
    return apiClient.get<ApiResponse<User[]>>(`/likes/blog/${blogId}`);
}

export const getCommentLikes = (commentId: string) => {
    return apiClient.get<ApiResponse<User[] >>(`/likes/comment/${commentId}`);
}