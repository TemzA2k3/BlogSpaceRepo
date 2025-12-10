import { type FC } from "react";
import type { ArticlePreview } from "@/shared/types/article.types";
import { ArticleCard } from "@/components/ArticleCard";

interface ArticlesGridProps {
  articles: ArticlePreview[];
}

export const ArticlesGrid: FC<ArticlesGridProps> = ({ articles }) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
};
