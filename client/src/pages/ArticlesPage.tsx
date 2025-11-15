import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { fetchArticles } from "@/store/slices/articleSlice";
import { ArticleCard } from "@/components/ArticleCard";

import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";

export const ArticlesPage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector((state) => state.auth);
    const { articles, isLoading, error } = useAppSelector((state) => state.articles);
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [searchTerm, setSearchTerm] = useState("");

    // Загружаем статьи при монтировании
    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    // Показываем ошибки, если они есть
    useEffect(() => {
        if (error) {
            showAlert(error, "error");
        }
    }, [error, showAlert]);

    const handleNavigate = () => {
        if (currentUser) navigate("create-article");
        else {
            showAlert(t("articles.notAuthForCreateaArticle"), "error");
            navigate("/signin");
        }
    };

    const filteredArticles = articles.filter((article) => {
        const term = searchTerm.toLowerCase();
        return (
            article.title.toLowerCase().includes(term) ||
            article.author.toLowerCase().includes(term) ||
            article.tags.some((tag) => tag.name.toLowerCase().includes(term))
        );
    });

    return (
        <main className="max-w-6xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-100">
            {/* Поисковая строка */}
            <div className="mb-8 flex justify-start gap-3">
                <input
                    type="text"
                    placeholder={t("articles.searchArticles")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-darkbg px-4 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                    onClick={handleNavigate}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 h-[38px] text-sm font-medium transition-all whitespace-nowrap"
                >
                    {t("articles.createArticle")}
                </button>
            </div>

            {/* Сетка статей */}
            {isLoading ? (
                <Loader/>
            ) : filteredArticles.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            author={article.author}
                            authorId={article.authorId}
                            content={article.content}
                            tags={article.tags}
                            imageUrl={article.imageUrl}
                        />
                    ))}
                </div>
            ) : (
                <BlankData
                    icon="📚"
                    title={t('articles.articlesNotFound')}
                    message={t('articles.articlesNotFoundHint')}
                />
            )}
        </main>
    );
};
