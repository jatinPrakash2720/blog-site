import type { User } from "./User";

export interface Comment {
    _id: string;
    content: string;
    blog: string;
    owner: User;
    createdAt: string;
    updatedAt: string;
  }