import { useParams, useNavigate } from "react-router-dom";

import { useArticleData } from "@/hooks/articles/useArticleData";

import { formatDate, calculateReadTime } from "@/shared/utils/timeFormatter"
import { getImageUrl } from "@/shared/utils/getImagesUrls";

import { Loader } from "@/shared/components/Loader";

import { ArticleSection } from "@/components/ArticleSection";
import { NotFoundPage } from "./NotFoundPage";


export const SpecificArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const { articleData, loading } = useArticleData(id);
    const navigate = useNavigate();

    if (loading) return <Loader />;

    if (!articleData) return <NotFoundPage />;

    return (
        <div className="min-h-screen dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
            {/* Main Content */}
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
                        <span>
                            Published on {formatDate(articleData.createdAt)}
                        </span>
                        <span>•</span>
                        <span>
                            Estimated {calculateReadTime(articleData.sections)} min read
                        </span>
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
                                <ArticleSection
                                    title={section.title}
                                    content={section.content}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Hashtags (at the bottom of the article, above interaction buttons) */}
                    {articleData.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {articleData.hashtags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Interaction Buttons */}
                    <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-700 my-8">
                        {/* Лайк */}
                        <button className="flex items-center gap-2 text-sm cursor-pointer transition-colors 
                     group text-slate-600 dark:text-gray-400 
                     hover:text-red-500">
                            <i className={`far fa-heart ${articleData.likes ? 'fas text-red-500' : ''}`}></i>
                            <span className="text-sm font-medium">{articleData.likes}</span>
                        </button>

                        {/* Комментарий */}
                        <button className="flex items-center gap-2 text-sm cursor-pointer transition-colors 
                     text-slate-600 dark:text-gray-400 
                     hover:text-blue-500">
                            <i className="far fa-comment"></i>
                            <span className="text-sm font-medium">{articleData.comments}</span>
                        </button>

                        {/* Закладки */}
                        <button className="flex items-center gap-2 text-sm cursor-pointer transition-colors 
                     text-slate-600 dark:text-gray-400 
                     hover:text-yellow-500">
                            <i className={`far fa-bookmark ${articleData.likes ? 'fas text-yellow-500' : ''}`}></i>
                            <span className="text-sm font-medium">{articleData.saved}</span>
                        </button>
                    </div>

                </article>

                {/* Comments Section (hardcoded) */}
                <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-10 transition-colors duration-300 mt-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Comments</h2>
                    <div className="space-y-6">
                        {/* Comment 1 */}
                        <div className="flex gap-4">
                            <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">Mark Thompson</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Great article! I especially appreciated the section on ethical considerations. It's something we
                                    need to discuss more.
                                </p>
                            </div>
                        </div>

                        {/* Comment 2 */}
                        <div className="flex gap-4 ml-12">
                            <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">Emily Clark</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    I agree, Mark. The ethical implications of AI are often overlooked. This article provides a good
                                    overview of the key issues.
                                </p>
                            </div>
                        </div>

                        {/* Comment 3 */}
                        <div className="flex gap-4">
                            <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">David Lee</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    The future of AI is exciting, but we need to be cautious. The potential for job displacement is a
                                    real concern that needs to be addressed proactively.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </div>
    );
};
