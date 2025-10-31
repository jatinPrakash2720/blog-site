import { apiClient } from "../lib/apiConfig.ts";
import type * as apiInterfaces from "../types/apisInterfaces/api.ts";
import type { ApiResponse } from "../types/apiResponse.ts";
import type { Blog } from "@/types/modalsInterfaces/Blog.ts";
import type {
  CreateBlogData,
  GetBlogsParams,
  PaginatedBlogResponse,
  UpdateBlogDetailsData,
} from "@/types/apisInterfaces/blog.api.ts";

export const getBlogs = (params: GetBlogsParams) => {
  return apiClient.get<ApiResponse<PaginatedBlogResponse>>("/blogs", {
    params,
  });
};
export const getSearchedBlog = (blogId: string) => {
  return apiClient.get<ApiResponse<Blog>>(`/blogs/${blogId}`);
};

export const getBlogByOwner = (blogId: string) => {
  return apiClient.get<ApiResponse<Blog>>(`/blogs/own/${blogId}`);
};

export const createBlog = (data: CreateBlogData) => {
  return apiClient.post<ApiResponse<Blog>>("/blogs", data);
};

export const updateBlogDetails = ({
  blogId,
  status,
  thumbnail,
}: UpdateBlogDetailsData) => {
  const formData = new FormData();
  formData.append("status", status);
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }
  return apiClient.patch<ApiResponse<{ data: apiInterfaces.Blog }>>(
    `/blogs/${blogId}/details`,
    formData
  );
};

export const updateBlogTitle = ({
  blogId,
  newTitle,
}: apiInterfaces.UpdateBlogTitlePayload) => {
  return apiClient.patch(`blogs/${blogId}/title`, { newTitle });
};

export const updateBlogContent = ({
  blogId,
  newContent,
}: apiInterfaces.UpdateBlogContentPayload) => {
  return apiClient.patch(`/blogs/${blogId}/content`, { newContent });
};

export const UpdateBlogThumbnail = ({
  blogId,
  thumbnailFormData,
}: apiInterfaces.UpdateBlogThumbnailPayload) => {
  return apiClient.patch<ApiResponse<{ data: apiInterfaces.Blog }>>(
    `/blogs/${blogId}/thumbnail`,
    thumbnailFormData
  );
};

export const toggleBlogStatus = (blogId: string) => {
  return apiClient.patch<
    ApiResponse<{ data: apiInterfaces.ReturnToggleStatusData }>
  >(`/blogs/${blogId}/toggle-status`);
};

export const deleteBlog = (blogId: string) => {
  return apiClient.delete(`/blogs/${blogId}`);
};

export const restoreBlog = (blogId: string) => {
  return apiClient.patch(`/blogs/${blogId}/restore`);
};

export const getBlogsByTopLevelCategory = (
  categoryId: string,
  params: apiInterfaces.GetBlogsParams = {}
) => {
  return apiClient.get<ApiResponse<apiInterfaces.PaginatedBlogResponse>>(
    `/blogs/by-category/${categoryId}`,
    { params }
  );
};

export const getBlogsBySubCategory = (
  subCategoryId: string,
  params: apiInterfaces.GetBlogsParams = {}
) => {
  return apiClient.get<
    ApiResponse<{ data: apiInterfaces.PaginatedBlogResponse }>
  >(`/blogs/by-sub-category/${subCategoryId}`, { params });
};

export const getFollowingFeed = (params: apiInterfaces.GetBlogsParams = {}) => {
  // Corrected: Added the ApiResponse wrapper to the return type
  return apiClient.get<ApiResponse<apiInterfaces.PaginatedBlogResponse>>(
    "/blogs/feed/following",
    { params }
  );
};
