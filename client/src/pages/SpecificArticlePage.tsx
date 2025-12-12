import { useParams, useNavigate } from "react-router-dom";

import { useArticleData } from "@/hooks/articles/useArticleData";

import { formatDate, calculateReadTime } from "@/shared/utils/timeFormatter";
import { getImageUrl } from "@/shared/utils/getImagesUrls";

import { Loader } from "@/shared/components/Loader";
import { ArticleSection } from "@/components/ArticleSection";
import { NotFoundPage } from "./NotFoundPage";

import { HashTagsDisplay } from "@/components/HashTagsDisplay";
import { CommentsSection } from "@/components/CommentsSection";

export const SpecificArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const { articleData, loading, handleLike, handleSave, addCommentToArticle } = useArticleData(id);
    const navigate = useNavigate();

    if (loading) return <Loader />;
    if (!articleData || !id) return <NotFoundPage />;
    

    return (
        <div className="min-h-screen dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div
                    className="flex items-center gap-2 text-sm mb-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-500"
                    onClick={() => navigate(-1)}
                >
                    <span className="text-lg">←</span>
                    <span>Вернуться назад</span>
                </div>

                {/* Article Header */}
                <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-10 transition-colors duration-300">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{articleData.title}</h1>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                        <span>By {articleData.author.fullName}</span>
                        <span>•</span>
                        <span>Published on {formatDate(articleData.createdAt)}</span>
                        <span>•</span>
                        <span>Estimated {calculateReadTime(articleData.sections)} min read</span>
                    </div>

                    {/* Hero Image */}
                    {articleData.coverImage && (
                        <div className="mb-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                                src={getImageUrl(articleData.coverImage)}
                                alt={articleData.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200">
                        {articleData.sections?.map((section, idx) => (
                            <div key={idx} className="mb-6">
                                <ArticleSection title={section.title} content={section.content} />
                            </div>
                        ))}
                    </div>

                    {/* Hashtags */}
                    <HashTagsDisplay tags={articleData.hashtags || []} />

                    {/* Interaction Buttons */}
                    <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-700 my-8">
                        <button
                            className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${articleData.likedByCurrentUser ? "text-red-500" : "text-slate-600 dark:text-gray-400"
                                } hover:text-red-500`}
                            onClick={handleLike}
                        >
                            <i className={`far fa-heart ${articleData.likedByCurrentUser ? "fas" : ""}`}></i>
                            <span className="text-sm font-medium">{articleData.likes}</span>
                        </button>

                        <button className="flex items-center gap-2 text-sm cursor-pointer transition-colors text-slate-600 dark:text-gray-400 hover:text-blue-500">
                            <i className="far fa-comment"></i>
                            <span className="text-sm font-medium">{articleData.commentsCount}</span>
                        </button>

                        <button
                            className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${articleData.savedByCurrentUser ? "text-yellow-500" : "text-slate-600 dark:text-gray-400"
                                } hover:text-yellow-500`}
                            onClick={handleSave}
                        >
                            <i className={`far fa-bookmark ${articleData.savedByCurrentUser ? "fas" : ""}`}></i>
                            <span className="text-sm font-medium">{articleData.saved}</span>
                        </button>
                    </div>
                </article>

                {/* Comments Section */}
                <CommentsSection
                    articleId={+id}
                    comments={articleData.comments}
                    addCommentToArticle={addCommentToArticle}
                />
            </section>
        </div>
    );
};
