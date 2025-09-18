import { apiClient } from "../lib/apiConfig.ts";
import type * as apiInterfaces from "../types/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";

export const getBlogComments = (
  blogId: string,
  params: apiInterfaces.PaginationParams = {}
) => {
  return apiClient.get<
    ApiResponse<apiInterfaces.PaginatedCommentResponse>
  >(`/comments/${blogId}`, { params });
};

export const addCommentToBlog = (
  blogId: string,
  data: apiInterfaces.CreateCommentPayload
) => {
  return apiClient.post<ApiResponse<apiInterfaces.Comment>>(
    `/comments/${blogId}`,
    data
  );
};

export const deleteComment = (commentId: string) => {
  return apiClient.delete(`/comments/c/${commentId}`);
};
