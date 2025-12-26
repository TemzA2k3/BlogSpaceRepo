import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";
import { Loader } from "@/shared/components/Loader";
import { BlankData } from "@/shared/components/BlankData";
import { UserCard } from "@/components/UserCard";
import { createChat } from "@/shared/services/createChat";

import type { UserCardProps } from "@/shared/types/user.types";
import type { ChatUser, ModalContentUsersListProps } from "@/shared/types/chat.types";

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
    const [error, setError] = useState<string | null>(null);
    const [creatingChatId, setCreatingChatId] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchData()
            .then(res => setData(res))
            .catch(e => setError(e.message || t("chat.loadingError")))
            .finally(() => setLoading(false));
    }, [fetchData, t]);

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
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex flex-col gap-4 p-4">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}

            {data.length > 0 ? (
                <div className="flex flex-col gap-3">
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