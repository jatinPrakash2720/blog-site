import type { Blog } from "../modalsInterfaces/Blog";

export interface GetUserBlogsParams {
    page?: number;
    limit?: number;
    userId: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";

  }

  export interface PaginatedBlogResponse {
    blogs: Blog[];
    totalDocs: number;
    limit: number;
    page: number;
    nextPage: number;
    prevPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    pagingCounter: number;
  }

  export interface GetBlogsParams  {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    q?: string;
  }
  

export interface UpdateBlogDetailsData {
    blogId: string;
    status: "published" | "draft";
    thumbnail?: File;
  }
  
  export interface UpdateBlogTitleData {
    blogId: string;
    newTitle: string;
  }

  export interface UpdateBlogContentData {
    blogId: string;
    newContent: string;
  }

  export interface UpdateBlogThumbnailData {
    blogId: string;
    thumbnailFormData: FormData;
  }

  export interface ReturnToggleStatusData {
    isPublished: Boolean;
    status: String;
    updatedAt: string;
  }