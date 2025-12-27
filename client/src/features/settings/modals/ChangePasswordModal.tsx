import {
    useState,
    useEffect,
    useRef,
    type FC
} from "react";
import { useTranslation } from "react-i18next";

import type {
    FormErrors,
    ChangePasswordModalProps
} from "@/shared/types/modal.types";

export const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
    loading,
    onSubmit,
    onClose,
}) => {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const currentPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        currentPasswordRef.current?.focus();
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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = t("settings.currentPasswordRequired");
        }

        if (!newPassword) {
            newErrors.newPassword = t("settings.newPasswordRequired");
        } else if (newPassword.length < 6) {
            newErrors.newPassword = t("settings.passwordMinLength");
        } else if (newPassword === currentPassword) {
            newErrors.newPassword = t("settings.passwordMustDiffer");
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = t("settings.confirmPasswordRequired");
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = t("settings.passwordsNotMatch");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm() && !loading) {
            onSubmit(currentPassword, newPassword);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const isFormValid = currentPassword && newPassword && confirmPassword && newPassword.length >= 6;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <i className="fa-solid fa-key text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("settings.changePassword")}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t("settings.currentPassword")}
                            </label>
                            <div className="relative">
                                <input
                                    ref={currentPasswordRef}
                                    type={showPasswords.current ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        if (errors.currentPassword) {
                                            setErrors(prev => ({ ...prev, currentPassword: undefined }));
                                        }
                                    }}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent outline-none transition-all ${errors.currentPassword
                                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                        }`}
                                    placeholder={t("settings.currentPasswordPlaceholder")}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("current")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <i className={`fa-solid ${showPasswords.current ? "fa-eye-slash" : "fa-eye"}`} />
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.currentPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t("settings.newPasswordLabel")}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (errors.newPassword) {
                                            setErrors(prev => ({ ...prev, newPassword: undefined }));
                                        }
                                    }}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent outline-none transition-all ${errors.newPassword
                                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                        }`}
                                    placeholder={t("settings.newPasswordPlaceholder")}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("new")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <i className={`fa-solid ${showPasswords.new ? "fa-eye-slash" : "fa-eye"}`} />
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.newPassword}</p>
                            )}
                            {!errors.newPassword && newPassword && newPassword.length < 6 && (
                                <p className="mt-1.5 text-sm text-yellow-500">
                                    {t("settings.passwordMinLength")}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t("settings.confirmNewPassword")}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) {
                                            setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                                        }
                                    }}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent outline-none transition-all ${errors.confirmPassword
                                        ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                                        : confirmPassword && confirmPassword === newPassword
                                            ? "border-green-300 dark:border-green-600 focus:ring-green-500"
                                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                        }`}
                                    placeholder={t("settings.confirmPasswordPlaceholder")}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <i className={`fa-solid ${showPasswords.confirm ? "fa-eye-slash" : "fa-eye"}`} />
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                            {!errors.confirmPassword && confirmPassword && confirmPassword === newPassword && (
                                <p className="mt-1.5 text-sm text-green-500">
                                    <i className="fa-solid fa-check mr-1" />
                                    {t("settings.passwordsMatch")}
                                </p>
                            )}
                        </div>
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
                            disabled={!isFormValid || loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <i className="fa-solid fa-spinner fa-spin" />}
                            {loading ? t("settings.changing") : t("settings.changePassword")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};