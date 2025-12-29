import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { useDebounce } from "@/hooks/debounce/useDebounce";

import { fetchArticles } from "@/store/slices/articleSlice";

export const useArticles = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { articles, isLoading, error, hasMore } = useAppSelector(state => state.articles);
    const { showAlert } = useAlert();

    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
    
    const debouncedSearch = useDebounce(searchTerm, 500);
    const prevSearchRef = useRef<string | null>(null);

    useEffect(() => {
        if (debouncedSearch) {
            setSearchParams({ search: debouncedSearch }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }, [debouncedSearch, setSearchParams]);

    useEffect(() => {
        const isNewSearch = prevSearchRef.current !== debouncedSearch;
        prevSearchRef.current = debouncedSearch;

        dispatch(fetchArticles({ search: debouncedSearch, isNewSearch }));
    }, [debouncedSearch, dispatch]);

    useEffect(() => {
        if (error) showAlert(error, "error");
    }, [error, showAlert]);

    const fetchNextArticles = () => {
        if (isLoading || !hasMore) return;
        dispatch(fetchArticles({ search: debouncedSearch, isNewSearch: false }));
    };

    return {
        articles,
        searchTerm,
        setSearchTerm,
        isLoading,
        hasMore,
        fetchNextArticles
    };
};