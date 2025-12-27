import { useTranslation } from "react-i18next";

import { useUserSubs } from "@/hooks/users/useUserSubs";

import { InfiniteObserver } from "@/shared/components/InfiniteObserver";
import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";

import { UserCard } from "@/components/UserCard";


import { fetchUserFollowing } from "@/shared/services/fetchUserSubs";

export const UserFollowingPage = () => {
    const { t } = useTranslation();
    const {
        items: following,
        loading,
        hasMore,
        fetchNext,
        containerRef,
    } = useUserSubs(fetchUserFollowing);

    return (
        <main className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-6">{t("profile.followingHeader")}</h2>
            {loading && following.length === 0 ? (
                <Loader />
            ) : following.length === 0 ? (
                <div className="mt-10">
                    <BlankData
                        icon="📭"
                        title={t("profile.blankFollowing")}
                        message={t("profile.blankFollowingLabel")}
                    />
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="flex flex-col gap-4 h-[60vh] overflow-y-auto"
                >
                    {following.map(user => (
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