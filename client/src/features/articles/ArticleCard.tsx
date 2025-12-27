import { type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getImageUrl } from "@/shared/utils/getImagesUrls";

import { HashTagsDisplay } from "@/features/hashtags/HashTagsDisplay";

import { type ArticlePreview } from "@/shared/types/article.types";

export const ArticleCard: FC<ArticlePreview> = ({
    id,
    title,
    author,
    authorId,
    description,
    sections,
    tags,
    imageUrl
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <article
            onClick={() => navigate(`/articles/${id}`)}
            className="rounded-2xl bg-white dark:bg-darkbg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">

            <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                <img
                    src={getImageUrl(imageUrl)}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>

                <p className="text-sm mb-3">
                    {t("articles.author")}:{" "}
                    <Link
                        to={`/users/${authorId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {author}
                    </Link>
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-2">
                    {description
                        ? description
                        : sections.length > 0
                            ? sections[0].content || t("articles.noContent")
                            : t("articles.noContent")}
                </p>

                <HashTagsDisplay tags={tags} />
            </div>
        </article>
    );
};