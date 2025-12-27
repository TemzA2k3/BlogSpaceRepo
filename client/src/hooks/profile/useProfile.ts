import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { fetchProfileUserData } from "@/shared/services/fetchUsersData";
import { type ProfileUserData } from "@/shared/types/user.types";

export function useProfile(userId: string | undefined, currentUserId?: number) {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<ProfileUserData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMyProfile, setIsMyProfile] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setIsMyProfile(currentUserId ? +userId === currentUserId : false);

        fetchProfileUserData(userId)
            .then(setUserData)
            .catch((e) => {
                setError(e.message || t("profile.fetchProfileError"));
                if (window.history.length > 1) {
                    navigate(-1);
                } else {
                    navigate(`/`);
                }
            })
            .finally(() => setLoading(false));
    }, [userId, currentUserId]);

    return { userData, loading, error, isMyProfile, setUserData, setError };
}