import type {
  User,
  ChangePasswordData,
  Blog,
  PaginatedBlogResponse,
  GetBlogsParams,
  UpdateBlogTitlePayload,
  UpdateBlogContentPayload,
  UpdateBlogDetailsPayload,
  UpdateBlogThumbnailPayload,
  GetUserBlogsParams,
  PaginationParams,
  Category,
  CreateSubCategoryPayload,
  SaveCollection,
  CreateSaveCollectionPayload,
  UpdateSaveCollectionPayload,
  Comment,
  VerifyUserPayload,
  SignUpData,
} from "./apisInterfaces/api.ts";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Editor } from "@tiptap/react";
import type {
  ForgotPasswordData,
  LoginData,
  ResetPasswordData,
  VerifyUserData,
} from "./apisInterfaces/user.api.ts";
import type { UserPageProfile } from "./modalsInterfaces/User.ts";
import type { ApiResponse } from "./apiResponse.ts";

export interface IAuthContext {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isAuthReady: boolean;
  viewedProfile: UserPageProfile | null;
  login: (credentials: LoginData) => Promise<{
    status: number;
    statusCode?: number;
    success: boolean;
    message?: string;
    data?: { user: User; accessToken: string; provider?: "google" | "github" };
  }>;
  // register: (userData: RegisterData) => Promise<void>;
  signUp: (
    userData: SignUpData
  ) => Promise<ApiResponse<{ success: boolean; message: string }> | null>;
  verifyUser: (userData: VerifyUserData) => Promise<{
    status: number;
    success: boolean;
    message?: string;
    data?: { user: User; accessToken?: string; refreshToken?: string } | null;
  }>;
  uniqueUsername: (
    username: string
  ) => Promise<ApiResponse<{ success: boolean; message: string }>>;
  resendVerifyCode: (
    email: string
  ) => Promise<ApiResponse<{ success: boolean; message: string }>>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  updateAvatar: (avatarData: FormData) => Promise<void>;
  updateCoverImage: (coverImageData: FormData) => Promise<void>;
  updateFullName: (fullName: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  forgotPassword: (payload: ForgotPasswordData) => Promise<{
    status: number;
    success: boolean;
    message?: string;
    data?: { success: boolean; message: string };
  }>;
  restorePassword: (
    token: string,
    payload: ResetPasswordData
  ) => Promise<{ status: number; success: boolean; message?: string }>;
  clearAuthError: () => void;
  continueWithGoogle: () => void;
  continueWithGithub: () => void;
  fetchCurrentUser: () => Promise<void>;
  fetchUserProfile: (username: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface IBlogContext {
  allBlogs: Blog[];
  currentBlog: Blog | null;
  userBlogs: Blog[];
  trendingBlogs: Blog[];
  readHistory: Blog[];
  loading: boolean;
  loadingSingleBlog: boolean;
  error: string | null;
  pagination: PaginatedBlogResponse | null;
  userBlogsPagination: PaginatedBlogResponse | null;
  readHistoryPagination: PaginatedBlogResponse | null;
  feedBlogs: Blog[];
  feedPagination: PaginatedBlogResponse | null;
  fetchAllBlogs: (params?: GetBlogsParams) => Promise<void>;
  fetchSearchBlog: (
    blogId: string
  ) => Promise<{
    success: boolean;
    status: number;
    message: string;
    data?: Blog;
  }>;
  fetchBlogsByCategory: (
    categoryId: string,
    params?: GetBlogsParams
  ) => Promise<void>;
  initiateBlogCreation: (data: {
    title: string;
    content: string;
  }) => Promise<Blog | null>;
  updateBlogDetailsAction: (
    payload: UpdateBlogDetailsPayload
  ) => Promise<boolean>;

  updateBlogTitleAction: (payload: UpdateBlogTitlePayload) => Promise<boolean>;
  updateBlogContentAction: (
    payload: UpdateBlogContentPayload
  ) => Promise<boolean>;
  updateBlogThumbnailAction: (
    payload: UpdateBlogThumbnailPayload
  ) => Promise<boolean>;
  toggleBlogStatusAction: (blogId: string) => Promise<boolean>;
  deleteBlogAction: (blogId: string) => Promise<boolean>;
  restoreBlogAction: (blogId: string) => Promise<boolean>;
  fetchUserBlogs: (params: GetUserBlogsParams) => Promise<void>;
  fetchReadHistory: (params?: PaginationParams) => Promise<void>;
  fetchFollowingFeed: (params?: GetBlogsParams) => Promise<void>;
}

export interface BlogProviderProps {
  children: ReactNode;
}

interface mainCategory {
  _id: string; // Use string on the frontend
  slug: string;
  name: string;
  type: "pre-defined";
}

export interface ICategoryContext {
  topLevelCategories: Category[];
  subCategories: Category[];
  filterableSubCategories: mainCategory[];
  // filterableSubCategories: Category[];
  loading: boolean;
  error: string | null;
  fetchTopLevelCategories: () => Promise<void>;
  fetchSubCategories: (parentId: string) => Promise<void>;
  fetchFilterableSubCategories: () => Promise<void>;
  // fetchFilterableSubCategories: (
  //   parentId: string,
  //   threshold?: number
  // ) => Promise<void>;
  createSubCategory: (
    parentId: string,
    data: CreateSubCategoryPayload
  ) => Promise<boolean>;
}

export interface CategoryProviderProps {
  children: ReactNode;
}

export interface ISocialContext {
  // State
  comments: Comment[];
  followers: User[];
  following: User[];
  collections: SaveCollection[];
  likedByUsers: User[];
  loading: boolean;
  error: string | null;

  // Comment Functions
  fetchComments: (blogId: string) => Promise<void>;
  addComment: (blogId: string, content: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;

  // Like Functions
  toggleBlogLike: (blogId: string) => Promise<boolean>;
  toggleCommentLike: (commentId: string) => Promise<boolean>;
  fetchUsersWhoLikedBlog: (blogId: string) => Promise<void>;
  fetchUsersWhoLikedComment: (commentId: string) => Promise<void>;

  // Follow Functions
  toggleFollowUser: (userId: string) => Promise<boolean>;
  fetchFollowers: (userId: string) => Promise<void>;
  fetchFollowing: (userId: string) => Promise<void>;

  // Save Functions
  createSaveCollection: (data: CreateSaveCollectionPayload) => Promise<boolean>;
  fetchCollections: () => Promise<void>;
  toggleSaveToCollection: (
    collectionId: string,
    blogId: string
  ) => Promise<void>;
  updateSaveCollection: (
    collectionId: string,
    data: UpdateSaveCollectionPayload
  ) => Promise<boolean>;
  deleteSaveCollection: (collectionId: string) => Promise<boolean>;
}

export interface SocialProviderProps {
  children: ReactNode;
}

export interface IEditorContext {
  editor: Editor | null;
  title: string;
  content: string;
  wordCount: Number;
  isSaving: boolean;
  handleSave: () => void;
  handlePreview: () => void;
  setEditor: Dispatch<SetStateAction<Editor | null>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setContent: Dispatch<SetStateAction<string>>;
  setWordCount: Dispatch<SetStateAction<number>>;
}
