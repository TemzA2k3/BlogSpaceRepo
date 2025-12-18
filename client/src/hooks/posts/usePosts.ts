import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { getPosts, resetPosts } from "@/store/slices/postSlice";

export const usePosts = () => {
    const dispatch = useAppDispatch();
    const { posts, loading, error, hasMore } = useAppSelector(state => state.posts);
    const { showAlert } = useAlert();    

    useEffect(() => {
        dispatch(resetPosts());
        dispatch(getPosts());
    }, [dispatch]);

    const fetchNextPosts = () => {
        if (loading || !hasMore) return;

        dispatch(getPosts());
    };

    useEffect(() => {
        if (error) {
            showAlert(error, "error");
        }
    }, [error]);

    return {
        userPosts: posts,
        loading,
        hasMore,
        fetchNextPosts
    };
};
