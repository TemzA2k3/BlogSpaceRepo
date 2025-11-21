import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";

import { UserCard } from "@/components/UserCard";

import type { UserCardProps } from "@/shared/types/user.types";

import { fetchUserFollowers } from "@/shared/services/fetchUserSubs";

export const UserFollowersPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { showAlert } = useAlert();

    const [followers, setFollowers] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        fetchUserFollowers(id)
            .then(data => setFollowers(data))
            .catch(e => setError(e.message || t("error.fetchError")))
            .finally(() => setLoading(false));
    }, [id, t]);

    useEffect(() => {
        if (!error) return;
        showAlert(error, "error");
    }, [error]);

    return (
        <main className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-6">{t("profile.followersHeader")}</h2>

            {loading ? (
                <Loader />
            ) : followers.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {followers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-gray-50 dark:bg-darkbg p-4 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() => console.log("Go to user", user.userName)}
                        >
                            <UserCard
                                id={user.id}
                                firstName={user.firstName}
                                lastName={user.lastName}
                                userName={user.userName}
                                avatar={user.avatar}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-10">
                    <BlankData
                        icon="📭"
                        title={t("profile.blankFollowers")}
                        message={t("profile.blankFollowersLabel")}
                    />
                </div>
            )}
        </main>
    );
};
