import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { fetchArticles, clearArticles } from "@/store/slices/articleSlice";

export const useArticles = () => {
    const dispatch = useAppDispatch();
    const { articles, isLoading, error, hasMore } = useAppSelector(state => state.articles);
    const { showAlert } = useAlert();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(clearArticles());
        dispatch(fetchArticles());
    }, [dispatch]);

    useEffect(() => {
        if (error) showAlert(error, "error");
    }, [error]);

    const fetchNextArticles = () => {
        if (isLoading || !hasMore) return;
        dispatch(fetchArticles());
    };

    const filteredArticles = articles.filter(article => {
        const term = searchTerm.toLowerCase();
        return Object.values(article).some(value => {
            if (typeof value === "string") return value.toLowerCase().includes(term);
            if (Array.isArray(value)) return value.some(item => item.name?.toLowerCase().includes(term));
            return false;
        });
    });

    return {
        articles: filteredArticles,
        searchTerm,
        setSearchTerm,
        isLoading,
        hasMore,
        fetchNextArticles
    };
};
