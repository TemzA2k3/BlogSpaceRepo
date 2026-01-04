import { useState, useRef, useEffect, type FC } from "react";
import { useTranslation } from "react-i18next";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import type { ChatHeaderProps } from "@/shared/types/chat.types"

export const ChatHeader: FC<ChatHeaderProps> = ({
    firstName,
    lastName,
    avatar,
    online,
    typing,
    onDeleteChat,
    deleting = false,
    onBack,
}) => {
    const { t } = useTranslation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleDeleteClick = () => {
        setShowDropdown(false);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        onDeleteChat?.();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="h-14 md:h-16 shrink-0 border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors shrink-0"
                        >
                            <i className="fa fa-arrow-left text-sm" />
                        </button>
                    )}

                    <div className="relative shrink-0">
                        <img
                            src={getAvatarUrl(firstName, lastName, avatar)}
                            alt={firstName}
                            className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover"
                        />
                        <span
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full 
                                border-2 border-gray-50 dark:border-gray-800 
                                ${online ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-semibold text-sm md:text-base truncate">
                            {firstName + ' ' + lastName}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {typing ? t("chat.typing") : online ? t("chat.online") : t("chat.offline")}
                        </p>
                    </div>
                </div>

                <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="h-8 w-8 md:h-9 md:w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <i className="fa fa-ellipsis-v text-sm" />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-44 md:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                            <button
                                onClick={handleDeleteClick}
                                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 md:gap-3 transition-colors"
                            >
                                <i className="fa-solid fa-trash-can w-4" />
                                <span>{t("chat.deleteChat")}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-trash-can text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                        {t("chat.deleteChatTitle")}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 md:px-6 py-4">
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                                {t("chat.deleteChatConfirm")}{" "}
                                <span className="font-medium">{firstName} {lastName}</span>?{" "}
                                {t("chat.deleteChatWarning")}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row md:justify-end gap-2 md:gap-3 px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="w-full md:w-auto px-4 py-2.5 md:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                            >
                                {t("chat.cancel")}
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="w-full md:w-auto px-4 py-2.5 md:py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {deleting && <i className="fa-solid fa-spinner fa-spin" />}
                                {deleting ? t("chat.deleting") : t("chat.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};