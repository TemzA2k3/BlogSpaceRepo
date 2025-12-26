import type { ReactNode } from "react";

export interface ChangePasswordModalProps {
    loading: boolean;
    onSubmit: (currentPassword: string, newPassword: string) => void;
    onClose: () => void;
}

export interface FormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export interface DeleteAccountModalProps {
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export interface EditFieldModalProps {
    title: string;
    initialValue: string;
    maxLength?: number;
    multiline?: boolean;
    loading?: boolean;
    prefix?: string;
    type?: "text" | "url" | "username";
    onSave: (value: string) => void;
    onClose: () => void;
}

export interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

export interface LanguageSelectModalProps {
    currentLanguage: string;
    onSelect: (lang: string) => void;
    onClose: () => void;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    width?: string;
    maxHeight?: string;
}

export interface ReportPostModalProps {
    loading?: boolean;
    onSubmit: (reason: string, description: string) => void;
    onClose: () => void;
}

export interface ReportReason {
    id: string;
    label: string;
    icon: string;
}