export interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  owner: User;
  views: number;
  isPublished: boolean;
  status: "draft" | "published" | "archived" | "pending";
  categories: Category[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isCommented?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent: string | null;
  blogCount: number;
}

export interface SaveCollection {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  blogs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  blog: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
}
//minor interfaces definition

// User Services
export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}
export interface RegisterData {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword?: string;
  newPassword?: string;
  newConfirmPassword?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ForgotPasswordPayload {
  identifier: string;
}

export interface ResetPasswordPayload {
  password?: string;
  confirmPassword?: string;
}

// Blog Services
export interface GetUserBlogsParams extends PaginationParams {
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

export interface GetBlogsParams extends PaginationParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
}

export interface UpdateBlogDetailsPayload{
  blogId: string;
  status: "published" |"draft";
  thumbnail?: File;
}

export interface UpdateBlogTitlePayload {
  blogId: string;
  newTitle: string;
}

export interface UpdateBlogContentPayload {
  blogId: string;
  newContent: string;
}

export interface UpdateBlogThumbnailPayload {
  blogId: string;
  thumbnailFormData: FormData;
}

export interface ReturnToggleStatusData {
  isPublished: Boolean;
  status: String;
  updatedAt: string;
}

// Category Services
export interface CreateSubCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

// Follow Service
export interface FollowToggleResponse {
  followed: boolean;
}

//Save Services
export interface CreateSaveCollectionPayload {
  name: string;
  description?: string;
}

export interface UpdateSaveCollectionPayload {
  name?: string;
  description?: string;
}

export interface ToggleBlogInCollectionResponse {
  saved: boolean;
  collection: SaveCollection;
}

//Like Services
export interface LikeToggleResponse {
  liked: boolean;
}

//Comment Services
export interface CreateCommentPayload {
  content: string;
}

export interface PaginatedCommentResponse {
  docs: Comment[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
