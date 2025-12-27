import { useState, useEffect, type FC } from "react";
import { useTranslation } from "react-i18next";

import type { ReportReason, ReportPostModalProps } from "@/shared/types/modal.types";

export const ReportPostModal: FC<ReportPostModalProps> = ({
    loading = false,
    onSubmit,
    onClose,
}) => {
    const { t } = useTranslation();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [description, setDescription] = useState("");

    const REPORT_REASONS: ReportReason[] = [
        { id: "spam", label: t("report.spam"), icon: "fa-bullhorn" },
        { id: "harassment", label: t("report.harassment"), icon: "fa-user-slash" },
        { id: "violence", label: t("report.violence"), icon: "fa-skull-crossbones" },
        { id: "misinformation", label: t("report.misinformation"), icon: "fa-circle-exclamation" },
        { id: "hate_speech", label: t("report.hatespeech"), icon: "fa-ban" },
        { id: "inappropriate", label: t("report.inappropriate"), icon: "fa-eye-slash" },
        { id: "other", label: t("report.other"), icon: "fa-ellipsis" },
    ];

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
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
        if (selectedReason && !loading) {
            onSubmit(selectedReason, description.trim());
        }
    };

    const isValid = selectedReason !== null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <i className="fa-solid fa-flag text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {t("report.title")}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t("report.subtitle")}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="px-6 py-4 overflow-y-auto flex-1">
                        <div className="space-y-2">
                            {REPORT_REASONS.map((reason) => (
                                <label
                                    key={reason.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedReason === reason.id
                                            ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-500"
                                            : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason.id}
                                        checked={selectedReason === reason.id}
                                        onChange={() => setSelectedReason(reason.id)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedReason === reason.id
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        <i className={`fa-solid ${reason.icon} text-sm`} />
                                    </div>
                                    <span
                                        className={`font-medium ${selectedReason === reason.id
                                                ? "text-red-700 dark:text-red-300"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {reason.label}
                                    </span>
                                    {selectedReason === reason.id && (
                                        <i className="fa-solid fa-check ml-auto text-red-500" />
                                    )}
                                </label>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                {t("report.additionalInfo")}{" "}
                                <span className="text-gray-400 font-normal">{t("report.optional")}</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={loading}
                                rows={3}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none transition-all"
                                placeholder={t("report.placeholder")}
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-xs text-gray-400">
                                    {description.length}/500
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
                        >
                            {t("report.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <i className="fa-solid fa-spinner fa-spin" />}
                            {loading ? t("report.sending") : t("report.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};