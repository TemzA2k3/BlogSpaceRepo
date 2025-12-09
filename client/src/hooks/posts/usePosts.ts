import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { getPosts } from "@/store/slices/postSlice";

export const usePosts = () => {
    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector(state => state.posts);
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                await dispatch(getPosts()).unwrap();
            } catch (err: any) {
                showAlert(err.message || "Ошибка при загрузке постов", "error");
            }
        };

        fetchPosts();
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showAlert(error, "error");
        }
    }, [error]);

    return { userPosts: posts, loading, error };
};
