import type { ChatUser } from "./chat.types";

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

    isPublicProfile?: boolean;
    whoCanMessage?: "everyone" | "followers" | "nobody";
    displayLanguage?: string;
}

export interface AuthState {
    currentUser: User | null;
    loading: boolean;
    success: boolean;
    error: string | null;
    initialized: boolean;

    settingsLoading: boolean;
    settingsUpdating: boolean;
    settingsError: string | null;
}

export interface RegisterUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateSettingsPayload {
    firstName?: string;
    lastName?: string;
    userName?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar?: string;
    isPublicProfile?: boolean;
    whoCanMessage?: "everyone" | "followers" | "nobody";
    displayLanguage?: string;
}

export interface ILoggedUserPreview {
    handleLogout: () => void;
    user: User;
}

export interface UserCardWithMessageProps extends UserCardProps {
    showMessageButton?: boolean;
    onMessageClick?: (id: string | number) => void;
}

export interface UserItemProps {
    user: ChatUser;
    isSelected: boolean;
    onClick: () => void;
}

export interface ProfileUserData extends User {
    followersCount: number;
    followingCount: number;
    isFollowing?: boolean;
    stats: ProfileStats
}

interface StatItem {
    value: number;
    change: number;
}

export interface ProfileStats {
    postsThisMonth: StatItem;
    newChats: StatItem;
    newFollowers: StatItem;
    newFollowing: StatItem;
    articlesPublished: StatItem;
    likesReceived: StatItem;
    commentsReceived: StatItem;
}

export interface StatCardProps {
    icon: string;
    title: string;
    value: number | string;
    change?: number;
    color: string;
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
    initialized: boolean;
}

export interface UserCardProps {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string | null;
}

export type FetchFn = (
    userId: string,
    offset: number,
    limit: number
) => Promise<UserCardProps[]>;