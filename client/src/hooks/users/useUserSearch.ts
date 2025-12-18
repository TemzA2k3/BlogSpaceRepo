import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { useAlert } from "@/app/providers/alert/AlertProvider";
import { useDebounce } from "@/hooks/debounce/useDebounce";

import { searchUsers } from "@/shared/services/searchUsers";

import type { UserCardProps } from "@/shared/types/user.types";

export const useUserSearch = () => {
    const { showAlert } = useAlert();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("query") || "");
    const debouncedSearchTerm = useDebounce(searchTerm, 750);

    const [users, setUsers] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchUsers = useCallback(async (term: string, reset = false, currentOffset = 0) => {
        if (!term) {
            setUsers([]);
            setOffset(0);
            setHasMore(false);
            return;
        }

        try {
            setLoading(true);
            const data = await searchUsers(term.toLowerCase(), currentOffset, 20);

            if (reset) setUsers(data);
            else setUsers(prev => [...prev, ...data]);

            setHasMore(data.length === 20);
            setOffset(currentOffset + data.length);
        } catch (e: any) {
            setError(e.message || "Ошибка при поиске пользователей");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedSearchTerm) {
            setSearchParams({ query: debouncedSearchTerm });
        } else {
            setSearchParams({});
        }
    }, [debouncedSearchTerm, setSearchParams]);
    

    useEffect(() => {
        setOffset(0);
        setHasMore(true);
        fetchUsers(debouncedSearchTerm, true, 0);
    }, [debouncedSearchTerm, fetchUsers]);

    useEffect(() => {
        if (error) showAlert(error, "error");
    }, [error]);

    const fetchNextUsers = () => {
        if (!loading && hasMore) fetchUsers(debouncedSearchTerm, false, offset);
    };

    return {
        users,
        searchTerm,
        setSearchTerm,
        loading,
        hasMore,
        fetchNextUsers
    };
};
