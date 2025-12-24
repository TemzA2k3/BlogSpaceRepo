import { type Dispatch, type SetStateAction, useState } from "react";
import { useAppDispatch } from "@/hooks/redux/reduxHooks";
import { setCurrentUser } from "@/store/slices/authSlice";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { changeUserAvatar, deleteUserAvatar } from "@/shared/services/changeUserAvatar";
import { useTranslation } from "react-i18next";
import { type ProfileUserData } from "@/shared/types/user.types";

export function useAvatarUpdater(
    setUserData?: Dispatch<SetStateAction<ProfileUserData | null>>
) {
    const { showAlert } = useAlert();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const handleAvatarChange = async (file: File | undefined) => {
        if (!file) return;
        setLoading(true);

        try {
            const updatedUser = await changeUserAvatar(file);
            dispatch(setCurrentUser(updatedUser));

            if (setUserData) {
                setUserData(prev => prev ? { ...prev, avatar: updatedUser.avatar } : prev);
            }

            showAlert(t("profile.updatedAvatar"), "success");
        } catch (err: any) {
            showAlert(err.message || t("profile.errorUpdatingAvatar"), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarDelete = async () => {
        setLoading(true);

        try {
            const updatedUser = await deleteUserAvatar();
            dispatch(setCurrentUser(updatedUser));

            if (setUserData) {
                setUserData(prev => prev ? { ...prev, avatar: null } : prev);
            }

            showAlert(t("profile.deletedAvatar"), "success");
        } catch (err: any) {
            showAlert(err.message || t("profile.errorDeletingAvatar"), "error");
        } finally {
            setLoading(false);
        }
    };

    return { handleAvatarChange, handleAvatarDelete, loading };
}