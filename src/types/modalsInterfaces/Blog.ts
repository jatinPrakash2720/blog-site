import type { Category } from "./Category";
import type { User } from "./User";

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
  