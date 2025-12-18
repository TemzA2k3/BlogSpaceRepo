import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { UserCard } from "@/components/UserCard";

import { BlankData } from "@/shared/components/BlankData";
import { Loader } from "@/shared/components/Loader";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";

import { useUserSearch } from "@/hooks/users/useUserSearch";

export const ExplorePage = () => {
    const { t } = useTranslation();
    const {
        users,
        searchTerm,
        setSearchTerm,
        loading,
        hasMore,
        fetchNextUsers
    } = useUserSearch();

    const usersContainerRef = useRef<HTMLDivElement>(null);
    
    return (
        <main className="max-w-3xl mx-auto py-10 px-4 text-gray-800 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t("explore.search")}</h2>

            <input
                type="text"
                placeholder={t("explore.searchUsers")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-darkbg px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition-all"
            />

            {loading && users.length === 0 ? (
                <Loader />
            ) : users.length === 0 ? (
                <BlankData
                    icon="🔍"
                    title={t("explore.usersNotFound")}
                    message={t("explore.usersNotFoundHint")}
                />
            ) : (
                <div
                    ref={usersContainerRef} 
                    className="flex flex-col gap-2 h-[60vh] overflow-y-auto">
                    {users.map(user => (
                        <UserCard key={user.id} {...user} />
                    ))}

                    <InfiniteObserver
                        root={usersContainerRef.current}
                        enabled={!loading && hasMore}
                        onIntersect={fetchNextUsers}
                    />
                </div>
            )}
        </main>
    );
};
