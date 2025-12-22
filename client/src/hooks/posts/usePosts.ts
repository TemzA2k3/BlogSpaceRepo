import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { getPosts, resetPosts } from "@/store/slices/postSlice";

import type { RecommendationsResponse } from "@/shared/types/post.types";
import { getPostsRecommendations } from "@/shared/services/getPostsRecommendations";

export const usePosts = () => {
    const dispatch = useAppDispatch();
    const { posts, loading, error, hasMore } = useAppSelector(state => state.posts);
    const { showAlert } = useAlert();

    const [recommendations, setRecommendations] = useState<RecommendationsResponse>({
        trendingTopics: [],
        suggestedUsers: [],
    });

    console.log(recommendations);
    

    useEffect(() => {
        dispatch(resetPosts());
        dispatch(getPosts());
    }, [dispatch]);

    const fetchNextPosts = () => {
        if (loading || !hasMore) return;
        dispatch(getPosts());
    };

    useEffect(() => {
        getPostsRecommendations()
            .then((data) => {
                if (data) {
                    setRecommendations(data);
                }
            })
            .catch((err: any) =>
                showAlert(err.message || "Ошибка при получении рекомендаций", "error")
            );
    }, []);
    

    useEffect(() => {
        if (error) {
            showAlert(error, "error");
        }
    }, [error]);

    return {
        userPosts: posts,
        loading,
        hasMore,
        fetchNextPosts,
        recommendations,
    };
};
