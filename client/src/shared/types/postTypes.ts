type HashTag = {
    id: number,
    name: string
}

export interface Post {
    id: number;
    content: string;
    hashtags: HashTag[];
    likes: number;
    comments: number;
    saved: number;
    image: string | null;
    createdAt: string;
}

export interface UsersPosts extends Post {
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface CreatePostData {
    content: string | null;
    hashtags: string[] | null;
    image: File | null
}

export interface PostCardProps {
    avatar: string;
    firstName: string;
    lastName: string;
    username: string;
    content: string;
    image: string | null;
    hashtags: HashTag[]
    date: string;
    likes: number;
    comments: number;
    saved: number;
}