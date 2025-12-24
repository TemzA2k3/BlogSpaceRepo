import { useState, useRef, useEffect, type FC } from "react";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

interface ChatHeaderProps {
    firstName: string;
    lastName: string;
    avatar: string | null;
    online: boolean;
    typing?: boolean;
    onDeleteChat?: () => void;
    deleting?: boolean;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ 
    firstName, 
    lastName, 
    avatar, 
    online, 
    typing,
    onDeleteChat,
    deleting = false,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
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
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={getAvatarUrl(firstName, lastName, avatar)}
                            alt={firstName}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full 
                                border-2 border-gray-50 dark:border-gray-800 
                                ${online ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                    </div>
                    <div>
                        <h2 className="font-semibold">{firstName + ' ' + lastName}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {typing ? "Печатает..." : online ? "В сети" : "Не в сети"}
                        </p>
                    </div>
                </div>

                {/* Dropdown menu */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="h-9 w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <i className="fa fa-ellipsis-v" />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                            <button
                                onClick={handleDeleteClick}
                                className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                            >
                                <i className="fa-solid fa-trash-can w-4" />
                                <span>Удалить чат</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <i className="fa-solid fa-trash-can text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Удалить чат?
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            <p className="text-gray-600 dark:text-gray-300">
                                Вы уверены, что хотите удалить переписку с{" "}
                                <span className="font-medium">{firstName} {lastName}</span>?
                                Это действие нельзя отменить.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {deleting && <i className="fa-solid fa-spinner fa-spin" />}
                                {deleting ? "Удаление..." : "Удалить"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
