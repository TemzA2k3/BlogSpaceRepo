import { type FC } from "react";
import { type Article } from "@/shared/types/articleTypes";

export const ArticleCard: FC<Omit<Article, "id">> = ({ title, author, content, tags, imageUrl }) => {
    return (
        <article className="rounded-2xl bg-white dark:bg-darkbg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">

            {/* Картинка сверху */}
            <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>

                {/* Ник автора с подсветкой */}
                <p className="text-sm mb-3">
                    Автор:{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        @{author}
                    </span>
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
};
