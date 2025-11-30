import { useState, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { followUser, unfollowUser } from "@/shared/services/userSubscriptions";

import { type ProfileUserData } from "@/shared/types/user.types";


export const useFollow = (
    userData: ProfileUserData | null,
    setUserData: Dispatch<SetStateAction<ProfileUserData | null>>,
    currentUserId: number | undefined
) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { t } = useTranslation();

    const handleFollow = async () => {
        if (!currentUserId) {
            navigate('/signin')
            return;
        }
        if (!userData) return;
        setLoading(true);

        try {
            if (userData.isFollowing) {
                await unfollowUser(userData.id);
                setUserData(prev => prev && ({
                    ...prev,
                    isFollowing: false,
                    followersCount: Math.max((prev.followersCount || 1) - 1, 0),
                }));
                showAlert(t('profile.unsubscribe'), "success");
            } else {
                await followUser(userData.id);
                setUserData(prev => prev && ({
                    ...prev,
                    isFollowing: true,
                    followersCount: (prev.followersCount || 0) + 1,
                }));
                showAlert(t('profile.subscribe'), "success");
            }
        } catch (err: any) {
            showAlert(err.message || t('profile.subError'), "error");
        } finally {
            setLoading(false);
        }
    };

    return { handleFollow, loading };
}
