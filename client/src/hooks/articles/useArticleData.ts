import { useState, useEffect } from "react";
import { fetchArticleData } from "@/shared/services/fetchArticleData";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import type { ArticleData } from "@/shared/types/article.types";

export const useArticleData = (articleId: string | undefined) => {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showAlert } = useAlert();

  const getArticleData = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchArticleData(id);
      setArticleData(data || null);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки статьи");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!articleId) return;
    getArticleData(articleId);
  }, [articleId]);

  useEffect(() => {
    if (!error) return;

    showAlert(error)
  }, [error])

  return { articleData, loading };
};
