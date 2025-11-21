import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useDebounce } from "@/hooks/useDebounce";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { searchUsers } from "@/shared/services/searchUsers";

import { UserCard } from "@/components/UserCard";
import { BlankData } from "@/shared/components/BlankData";
import { Loader } from "@/shared/components/Loader";

import type { UserCardProps } from "@/shared/types/user.types";

export const ExplorePage = () => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();
    const [searchParams, setSearchParams] = useSearchParams();

    const [users, setUsers] = useState<UserCardProps[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(() => searchParams.get("query") || "");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 750);

    // Сохраняем searchTerm в query параметры
    useEffect(() => {
        if (debouncedSearchTerm) {
            setSearchParams({ query: debouncedSearchTerm });
        } else {
            setSearchParams({});
            setUsers([]); // если пусто, очищаем результаты
        }
    }, [debouncedSearchTerm, setSearchParams]);

    // Запрос на сервер
    useEffect(() => {
        if (!debouncedSearchTerm) return;

        setLoading(true);
        setError(null);

        searchUsers(debouncedSearchTerm.toLowerCase())
            .then((users) => setUsers(users))
            .catch((e) => setError(e.message || t("error.fetchError")))
            .finally(() => setLoading(false));
    }, [debouncedSearchTerm]);

    // Ошибки
    useEffect(() => {
        if (error) showAlert(error, "error");
    }, [error, showAlert]);

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

            {loading ? (
                <Loader />
            ) : users.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {users.map((user) => (
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
                    icon="🔍"
                    title={t("explore.usersNotFound")}
                    message={t("explore.usersNotFoundHint")}
                />
            )}
        </main>
    );
};
