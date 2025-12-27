import { type FC } from "react";

import { ArticleCard } from "@/features/articles/ArticleCard";

import type { ArticlesGridProps} from "@/shared/types/article.types";

export const ArticlesGrid: FC<ArticlesGridProps> = ({ articles }) => {
    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(article => (
                <ArticleCard key={article.id} {...article} />
            ))}
        </div>
    );
};
