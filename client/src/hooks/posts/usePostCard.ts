import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { likePost, deletePost, toggleSavePost } from "@/store/slices/postSlice";

import type { UsersPosts } from "@/shared/types/post.types";

export const usePostCard = (
    post: UsersPosts,
    onPostUpdate?: (updatedPost: UsersPosts | null) => void,
    onPostDelete?: (postId: number) => void
) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
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
        if (!currentUser){
            navigate("/signin");

            return;
        };

        try {
            const updatedPost = await dispatch(likePost(post.id)).unwrap();
            onPostUpdate?.(updatedPost);
        } catch (err: any) {
            showAlert(err.message ?? t("posts.likeError"), "error");
        }
    };

    const handleToggleSave = async () => {
        if (!currentUser){
            navigate("/signin");

            return;
        };

        try {
            const updatedPost = await dispatch(toggleSavePost(post.id)).unwrap();
            onPostUpdate?.(updatedPost);
        } catch (err: any) {
            showAlert(err.message ?? t("posts.saveError"), "error");
        }
    };

    const handleDeletePost = async () => {
        try {
            const resultAction = await dispatch(deletePost(post.id));
            if (deletePost.fulfilled.match(resultAction)) {
                showAlert(t("posts.deleteSuccess"), "success");
                onPostDelete?.(post.id);
            } else {
                showAlert(resultAction.payload as string ?? t("posts.deleteError"), "error");
            }
        } catch (err: any) {
            showAlert(err.message ?? t("posts.deleteError"), "error");
        }
    };

    return {
        showDropdown,
        setShowDropdown,
        dropdownRef,
        handleToggleLike,
        handleToggleSave,
        handleDeletePost,
        currentUser,
    };
};