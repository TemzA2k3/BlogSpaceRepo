export interface User {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    role: string;
    avatar: string | null;
    isBlocked: boolean;
    bio?: string;
    location?: string;
    website?: string;
    createdAt?: string;
    followersCount: number;
    followingCount: number;
}

export interface RegisterUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginUserData {
    email: string;
    password: string;
    remember: boolean;
}

export interface AuthState {
    currentUser: User | null;
    loading: boolean;
    success: boolean;
    error: string | null;
}