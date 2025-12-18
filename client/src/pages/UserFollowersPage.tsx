import { useTranslation } from "react-i18next";

import { useUserSubs } from "@/hooks/users/useUserSubs";

import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";

import { UserCard } from "@/components/UserCard";
import { fetchUserFollowers } from "@/shared/services/fetchUserSubs";

export const UserFollowersPage = () => {
    const { t } = useTranslation();

    const {
        items: followers,
        loading,
        hasMore,
        fetchNext,
        containerRef,
    } = useUserSubs(fetchUserFollowers);

    return (
        <main className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-6">
                {t("profile.followersHeader")}
            </h2>

            {loading && followers.length === 0 ? (
                <Loader />
            ) : followers.length === 0 ? (
                <div className="mt-10">
                    <BlankData
                        icon="📭"
                        title={t("profile.blankFollowers")}
                        message={t("profile.blankFollowersLabel")}
                    />
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="flex flex-col gap-4 h-[60vh] overflow-y-auto"
                >
                    {followers.map(user => (
                        <div
                            key={user.id}
                            className="bg-gray-50 dark:bg-darkbg p-4 rounded-xl shadow hover:shadow-lg transition"
                        >
                            <UserCard {...user} />
                        </div>
                    ))}

                    <InfiniteObserver
                        root={containerRef.current}
                        enabled={!loading && hasMore}
                        onIntersect={fetchNext}
                        rootMargin="200px"
                    />
                </div>
            )}
        </main>
    );
};
