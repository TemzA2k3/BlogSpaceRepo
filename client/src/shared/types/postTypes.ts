export interface Post {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    content: string;
    hashtags: string[];
    likes: number;
    comments: number;
    saved: number;
    avatar?: string;
    date: string;
}