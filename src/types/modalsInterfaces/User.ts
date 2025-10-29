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
    verifyCode: string;
    verifyCodeExpiry: Date;
  }
  export interface UserPageProfile {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    bio?: string;
    followerCount: number;
    followingCount: number;
    isFollowed: boolean;
  }