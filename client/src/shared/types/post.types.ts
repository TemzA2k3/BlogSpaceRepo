import type { HashTag } from "./hashTag.types";
import type { User } from "./user.types";
import type { Paggination } from "./paggination.types"; 

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
    savedByCurrentUser: boolean;
}

export interface UsersPosts extends Post {
    userId: number;
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface PostCardProps extends UsersPosts {
    onPostUpdate?: (updatedPost: UsersPosts | null) => void;
    onPostDelete?: (postId: number) => void;
}

export interface SpecificUserPost extends UsersPosts {}

export interface PostsState extends Paggination {
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