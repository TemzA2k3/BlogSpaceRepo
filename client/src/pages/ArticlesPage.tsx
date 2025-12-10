import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { fetchArticles } from "@/store/slices/articleSlice";
import { ArticlesGrid } from "@/components/ArticlesGrid";
import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";

import type { ArticlePreview } from "@/shared/types/article.types";

export const ArticlesPage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector(state => state.auth);
    const { articles, isLoading, error } = useAppSelector(state => state.articles);
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    useEffect(() => {
        if (error) showAlert(error, "error");
    }, [error]);

    const handleNavigate = () => {
        if (currentUser) navigate("create");
        else {
            showAlert(t("articles.notAuthForCreateaArticle"), "error");
            navigate("/signin");
        }
    };

    const filteredArticles = articles.filter((article: ArticlePreview) => {
        const term = searchTerm.toLowerCase();
        return Object.values(article).some(value => {
            if (typeof value === "string") return value.toLowerCase().includes(term);
            if (Array.isArray(value)) return value.some(item => item.name?.toLowerCase().includes(term));
            return false;
        });
    });

    return (
        <main className="max-w-6xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-100">
            {/* Search & Create */}
            <div className="mb-8 flex flex-col sm:flex-row justify-start gap-3">
                <input
                    type="text"
                    placeholder={t("articles.searchArticles")}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-darkbg px-4 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                    onClick={handleNavigate}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:h-[38px] text-sm font-medium transition-all whitespace-nowrap w-full sm:w-auto"
                >
                    {t("articles.createArticle")}
                </button>
            </div>

            {/* Articles */}
            {isLoading ? (
                <Loader />
            ) : filteredArticles.length > 0 ? (
                <ArticlesGrid articles={filteredArticles} />
            ) : (
                <BlankData
                    icon="📚"
                    title={t("articles.articlesNotFound")}
                    message={t("articles.articlesNotFoundHint")}
                />
            )}
        </main>
    );
};
