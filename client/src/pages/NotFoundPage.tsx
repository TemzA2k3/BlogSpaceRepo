import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";


export const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center max-w-md"
            >
                <h1 className="text-8xl sm:text-9xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
                    404
                </h1>

                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {t('notFound404.title')}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {t('notFound404.label')}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 dark:bg-blue-500
                     text-white font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-600
                     transition-colors duration-200"
                >
                    {t('notFound404.btnText')}
                </Link>

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-12 text-gray-300 dark:text-gray-600 text-6xl"
                >
                    <i className="fa-solid fa-compass"></i>
                </motion.div>
            </motion.div>
        </div>
    );
};
