import type { HashTag } from "./hashTag.types";
import type { User } from "./user.types";

export interface Post {
    id: number;
    content: string;
    hashtags: HashTag[];
    likes: number;
    comments: number;
    saved: number;
    image: string | null;
    createdAt: string;
    likedByCurrentUser: boolean;
}

export interface UsersPosts extends Post {
    userId: number;
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface PostsState {
    posts: UsersPosts[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface CreatePostData {
    content: string | null;
    hashtags: string[] | null;
    image: File | null
}

export type CreatePostSectionProps = Pick<
  User,
  "firstName" | "lastName" | "avatar" | "userName"
>;