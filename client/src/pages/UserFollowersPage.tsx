import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";

import { UserCard } from "@/components/UserCard";

import type { UserCardProps } from "@/shared/types/userTypes";

import { fetchUserFollowers } from "@/shared/services/fetchUserSubs";

export const UserFollowersPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { showAlert } = useAlert();

    const [followers, setFollowers] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        setLoading(true)

        fetchUserFollowers(id)
            .then(data => setFollowers(data))
            .catch(e => setError(e.message || t('error.fetchError')))
            .finally(() => setLoading(false))
    }, [id]);

    useEffect(() => {
        if (!error) return;
        showAlert(error, "error");
    }, [error]);

    return (
        <main className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t("profile.followersHeader")}</h2>

            {loading ? (
                <Loader />
            ) : followers.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {followers.map((user) => (
                        <UserCard
                            key={user.id}
                            id={user.id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            userName={user.userName}
                            avatar={user.avatar}
                        />
                    ))}
                </div>
            ) : (
                <BlankData
                    icon="📭"
                    title={t("profile.blankFollowers")}
                    message={t("profile.blankFollowersLabel")}
                />
            )}
        </main>
    );
}
