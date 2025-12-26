import { useState, useEffect, useRef, type FC } from "react";
import { useTranslation, Trans } from "react-i18next";

import type { DeleteAccountModalProps } from "../types/modal.types";

const CONFIRMATION_WORD = "DELETE";

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({
    loading,
    onConfirm,
    onClose,
}) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const isConfirmed = inputValue === CONFIRMATION_WORD;

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose, loading]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isConfirmed && !loading) {
            onConfirm();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <i className="fa-solid fa-triangle-exclamation text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("settings.deleteAccountTitle")}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("settings.deleteAccountWarning")}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t("settings.deleteAccountConfirmText")}
                        </p>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <i className="fa-solid fa-info-circle mr-2" />
                                <Trans
                                    i18nKey="settings.deleteAccountTypeHint"
                                    values={{ word: CONFIRMATION_WORD }}
                                    components={{ strong: <strong /> }}
                                />
                            </p>
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                            disabled={loading}
                            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent outline-none transition-all text-center font-mono text-lg tracking-widest ${inputValue && !isConfirmed
                                ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                                : isConfirmed
                                    ? "border-green-300 dark:border-green-600 focus:ring-green-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                }`}
                            placeholder={CONFIRMATION_WORD}
                        />

                        {inputValue && !isConfirmed && (
                            <p className="mt-2 text-sm text-red-500 text-center">
                                {t("settings.deleteAccountTypeMismatch", { word: CONFIRMATION_WORD })}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                        >
                            {t("settings.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={!isConfirmed || loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <i className="fa-solid fa-spinner fa-spin" />}
                            {loading ? t("settings.deleting") : t("settings.deleteAccount")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};