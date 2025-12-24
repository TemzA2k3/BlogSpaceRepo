import { useState, useEffect, useRef, type FC } from "react";

interface EditFieldModalProps {
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

const isValidUrl = (value: string): boolean => {
    if (!value) return true; // Empty is valid (optional field)
    
    // Simple URL pattern - должен содержать домен с точкой
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    return urlPattern.test(value);
};

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
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        // Focus input on mount
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        // Close on Escape
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Validate on value change
    useEffect(() => {
        if (type === "url" && value) {
            if (!isValidUrl(value)) {
                setError("Please enter a valid URL (e.g., example.com)");
            } else {
                setError(null);
            }
        } else {
            setError(null);
        }
    }, [value, type]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let newValue = e.target.value;

        // For username - prevent @ input
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
            // For username, add @ prefix if not present
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
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        {multiline ? (
                            <textarea
                                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                value={value}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                                placeholder={`Enter your ${title.toLowerCase()}...`}
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
                                    className={`w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                                        prefix ? "pl-8 pr-4" : "px-4"
                                    } ${error ? "border-red-500 focus:ring-red-500" : ""}`}
                                    placeholder={`Enter your ${title.toLowerCase()}...`}
                                />
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <p className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {/* Character counter */}
                        <div className="flex justify-end mt-2">
                            <span
                                className={`text-xs ${
                                    isOverLimit
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

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || isInvalid}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <i className="fa-solid fa-spinner fa-spin" />}
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
