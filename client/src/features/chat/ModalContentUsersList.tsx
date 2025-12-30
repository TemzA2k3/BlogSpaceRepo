import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";
import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";
import { UserCard } from "@/features/profile/UserCard";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";
import { createChat } from "@/shared/services/createChat";

import type { UserCardProps } from "@/shared/types/user.types";
import type { ChatUser, ModalContentUsersListProps } from "@/shared/types/chat.types";

const LIMIT = 20;

export const ModalContentUsersList: React.FC<ModalContentUsersListProps> = ({
    fetchData,
    title,
    blankIcon = "👥",
    blankTitle,
    blankMessage,
    onChatCreated,
}) => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();

    const [data, setData] = useState<UserCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [creatingChatId, setCreatingChatId] = useState<number | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadUsers = useCallback(async (currentOffset: number, isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const res = await fetchData(currentOffset, LIMIT);

            if (isInitial) {
                setData(res);
            } else {
                setData(prev => [...prev, ...res]);
            }

            setHasMore(res.length === LIMIT);
            setOffset(currentOffset + res.length);
        } catch (e: any) {
            setError(e.message || t("chat.loadingError"));
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [fetchData, t]);

    useEffect(() => {
        loadUsers(0, true);
    }, [loadUsers]);

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            loadUsers(offset);
        }
    }, [loadUsers, offset, loadingMore, hasMore]);

    const handleCreateChat = async (user: UserCardProps) => {
        try {
            setCreatingChatId(user.id);

            const newChatUser: ChatUser = await createChat(user.id);

            if (onChatCreated && newChatUser) {
                onChatCreated(newChatUser);
            }
        } catch (err: any) {
            setError(err.message || t("chat.createChatError"));
        } finally {
            setCreatingChatId(null);
        }
    };

    useEffect(() => {
        if (!error) return;
        showAlert(error, "error");
    }, [error, showAlert]);

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col gap-4 p-4">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}

            {data.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                    {data.map(user => (
                        <div
                            key={user.id}
                            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition-transform duration-200 flex justify-between items-center"
                        >
                            <UserCard {...user} />

                            <button
                                onClick={() => handleCreateChat(user)}
                                disabled={creatingChatId === user.id}
                                className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                            >
                                {creatingChatId === user.id ? t("chat.creating") : t("chat.write")}
                            </button>
                        </div>
                    ))}

                    {loadingMore && <Loader />}

                    <InfiniteObserver
                        onIntersect={handleLoadMore}
                        enabled={hasMore && !loadingMore}
                        rootMargin="100px"
                    />
                </div>
            ) : (
                <BlankData
                    icon={blankIcon}
                    title={blankTitle || t("chat.usersNotFound")}
                    message={blankMessage || t("chat.listEmpty")}
                />
            )}
        </div>
    );
};