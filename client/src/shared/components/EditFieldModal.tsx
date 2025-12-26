import { useState, useEffect, useRef, type FC } from "react";
import { useTranslation } from "react-i18next";

import { isValidUrl } from "../utils/urlValidator";

import type { EditFieldModalProps } from "../types/modal.types";

export const EditFieldModal: FC<EditFieldModalProps> = ({
    title,
    initialValue,
    maxLength = 100,
    multiline = false,
    loading = false,
    prefix,
    type = "text",
    onSave,
    onClose,
}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    useEffect(() => {
        if (type === "url" && value) {
            if (!isValidUrl(value)) {
                setError(t("settings.invalidUrl"));
            } else {
                setError(null);
            }
        } else {
            setError(null);
        }
    }, [value, type, t]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let newValue = e.target.value;

        if (type === "username") {
            newValue = newValue.replace(/@/g, "");
        }

        setValue(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (error) return;

        const trimmedValue = value.trim();

        if (trimmedValue !== initialValue) {
            const finalValue = type === "username" && !trimmedValue.startsWith("@")
                ? `@${trimmedValue}`
                : trimmedValue;
            onSave(finalValue);
        } else {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const charactersLeft = maxLength - value.length;
    const isOverLimit = charactersLeft < 0;
    const isInvalid = isOverLimit || !!error || value.trim() === "";

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("settings.editField", { field: title })}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        {multiline ? (
                            <textarea
                                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                value={value}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                                placeholder={t("settings.enterField", { field: title.toLowerCase() })}
                            />
                        ) : (
                            <div className="relative">
                                {prefix && (
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 select-none pointer-events-none">
                                        {prefix}
                                    </span>
                                )}
                                <input
                                    ref={inputRef as React.RefObject<HTMLInputElement>}
                                    type="text"
                                    value={value}
                                    onChange={handleInputChange}
                                    className={`w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${prefix ? "pl-8 pr-4" : "px-4"
                                        } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
                                    placeholder={t("settings.enterField", { field: title.toLowerCase() })}
                                />
                            </div>
                        )}

                        {error && (
                            <p className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end mt-2">
                            <span
                                className={`text-xs ${isOverLimit
                                        ? "text-red-500"
                                        : charactersLeft < 20
                                            ? "text-yellow-500"
                                            : "text-gray-400 dark:text-gray-500"
                                    }`}
                            >
                                {value.length}/{maxLength}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {t("settings.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || isInvalid}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <i className="fa-solid fa-spinner fa-spin" />}
                            {loading ? t("settings.saving") : t("settings.save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};