import { useState, useRef, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { deletePost, likePost } from "@/store/slices/postSlice";
import type { UsersPosts } from "@/shared/types/post.types";

export const usePostCard = (post: UsersPosts) => {
    const dispatch = useAppDispatch();
    const { showAlert } = useAlert();
    const { currentUser } = useAppSelector(state => state.auth);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleLike = async () => {
        if (!currentUser) return;

        try {
            await dispatch(likePost(post.id)).unwrap();
        } catch (err: any) {
            showAlert(err.message ?? "Ошибка при лайке", "error");
        }
    };

    const handleDeletePost = async () => {
        try {
            const resultAction = await dispatch(deletePost(post.id));
            if (deletePost.fulfilled.match(resultAction)) {
                showAlert("Пост успешно удален", "success");
            } else {
                showAlert(resultAction.payload as string ?? "Ошибка при удалении", "error");
            }
        } catch (err: any) {
            showAlert(err.message ?? "Ошибка при удалении", "error");
        }
    };

    return {
        showDropdown,
        setShowDropdown,
        dropdownRef,
        handleToggleLike,
        handleDeletePost,
        currentUser,
    };
};
