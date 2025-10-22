import type {
  User,
  LoginCredentials,
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
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RegisterData,
  VerifyUserPayload,
  SignUpData

} from "../types/api.ts";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Editor } from "@tiptap/react";

export interface IAuthContext {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isAuthReady: boolean;
  viewedProfile: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  verifyUser: (userData: VerifyUserPayload) => Promise<void>;
  completeProfileSetup: (userId: string, imageData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  updateProfile: (
    updateData: FormData | { fullName?: string; email?: string }
  ) => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<boolean>;
  restorePassword: (
    token: string,
    payload: ResetPasswordPayload
  ) => Promise<boolean>;
  clearAuthError: () => void;
  continueWithGoogle: () => void;
  continueWithGithub: () => void;
  fetchCurrentUser: () => Promise<boolean>;
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
  fetchSingleBlog: (blogId: string) => Promise<void>;
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