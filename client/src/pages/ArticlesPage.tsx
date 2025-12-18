import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ArticlesGrid } from "@/components/ArticlesGrid";
import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";

import { useArticles } from "@/hooks/articles/useArticles";
import { useAppSelector } from "@/hooks/redux/reduxHooks";

export const ArticlesPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector(state => state.auth);

    const {
        articles,
        searchTerm,
        setSearchTerm,
        isLoading,
        hasMore,
        fetchNextArticles
    } = useArticles();

    const handleNavigate = () => {
        if (currentUser) navigate("create");
        else {
            navigate("/signin");
        }
    };

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
            {isLoading && articles.length === 0 ? (
                <Loader />
            ) : articles.length === 0 ? (
                <BlankData
                    icon="📚"
                    title={t("articles.articlesNotFound")}
                    message={t("articles.articlesNotFoundHint")}
                />
            ) : (
                <>
                    <ArticlesGrid articles={articles} />

                    <InfiniteObserver
                        enabled={!isLoading && hasMore}
                        onIntersect={fetchNextArticles}
                        rootMargin="200px"
                    />
                </>
            )}
        </main>
    );
};
