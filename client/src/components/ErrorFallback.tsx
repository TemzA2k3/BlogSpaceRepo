import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import type { ErrorFallbackProps } from "@/shared/types/error.types"

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center pt-[10rem] justify-center dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center max-w-md"
            >
                <h1 className="text-8xl sm:text-9xl font-extrabold text-red-600 dark:text-red-400 mb-4">
                    😢
                </h1>

                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {t("errorBoundary.title")}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {t("errorBoundary.label")}
                </p>

                {resetErrorBoundary && (
                    <button
                        onClick={resetErrorBoundary}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 dark:bg-blue-500
            text-white font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-600
            transition-colors duration-200"
                    >
                        {t("errorBoundary.btnText")}
                    </button>
                )}

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-12 text-gray-300 dark:text-gray-600 text-6xl"
                >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </motion.div>

                {error && (
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-6 w-full overflow-x-auto text-left text-red-700 dark:text-red-300">
                        {error.message}
                    </pre>
                )}
            </motion.div>
        </div>
    );
};