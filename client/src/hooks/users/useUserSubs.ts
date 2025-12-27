import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";
import type { UserCardProps, FetchFn } from "@/shared/types/user.types";

import { SUBS_LIMIT } from "@/shared/constants/offsetSubs";

export const useUserSubs = (fetchFn: FetchFn) => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { showAlert } = useAlert();

    const [items, setItems] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);


    const containerRef = useRef<HTMLDivElement>(null);

    const fetchNext = useCallback(async () => {
        if (!id || loading || !hasMore) return;

        try {
            setLoading(true);

            const data = await fetchFn(id, offset, SUBS_LIMIT);

            setItems(prev => [...prev, ...data]);
            setHasMore(data.length === SUBS_LIMIT);
            setOffset(prev => prev + data.length);
        } catch (e: any) {
            showAlert(e.message || t("error.fetchError"), "error");
        } finally {
            setLoading(false);
        }
    }, [id, offset, hasMore, loading, fetchFn]);

    useEffect(() => {
        if (!id) return;

        setItems([]);
        setOffset(0);
        setHasMore(true);

        (async () => {
            try {
                setLoading(true);
                const data = await fetchFn(id, 0, SUBS_LIMIT);
                console.log(data.length);

                setItems(data);
                setHasMore(data.length === SUBS_LIMIT);
                setOffset(data.length);
            } catch (e: any) {
                showAlert(e.message || t("error.fetchError"), "error");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, fetchFn]);

    return {
        items,
        loading,
        hasMore,
        fetchNext,
        containerRef,
    };
};
