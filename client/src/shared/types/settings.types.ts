import type { ReactNode } from "react";
import type { User, UpdateSettingsPayload } from "@/shared/types/user.types";

export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export interface SelectButtonProps {
    value: string;
    onClick?: () => void;
}

export interface SettingGroupProps {
    title: string;
    children: ReactNode;
}

export interface SettingRowProps {
    label: string;
    description?: string;
    children: ReactNode;
}

export interface SettingsProps {
    settings: User;
    updating: boolean;
    onUpdate: <K extends keyof UpdateSettingsPayload>(
        key: K,
        value: UpdateSettingsPayload[K]
    ) => Promise<{ success: boolean }>;
}

export interface SettingsProps {
    settings: User;
    updating: boolean;
    onUpdate: <K extends keyof UpdateSettingsPayload>(
        key: K,
        value: UpdateSettingsPayload[K]
    ) => Promise<{ success: boolean }>;
}

export interface ProfileSettingsProps {
    settings: User;
    updating: boolean;
    onUpdate: (payload: UpdateSettingsPayload) => Promise<{ success: boolean }>;
}

export type EditableField = "firstName" | "lastName" | "userName" | "bio" | "location" | "website" | null;