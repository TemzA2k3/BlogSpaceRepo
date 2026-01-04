import { type FC, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/hooks/redux/reduxHooks';

import { UserItem } from './UserItem';
import { SearchInput } from '../../shared/components/SearchInput';
import { ModalContentUsersList } from './ModalContentUsersList';

import { BlankData } from '@/shared/components/BlankData';
import { Modal } from '@/shared/components/Modal';
import { Loader } from '@/shared/components/Loader';
import { InfiniteObserver } from '@/shared/components/InfiniteObserver';

import { fetchUserFollowing } from '@/shared/services/fetchUserSubs';

import type { ChatUser, UsersListProps } from '@/shared/types/chat.types';

export const UsersList: FC<UsersListProps> = ({
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    searchQuery,
    setSearchQuery,
    loadingMore,
    hasMore,
    fetchMoreChats,
    searching,
}) => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector(state => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const noUsers = users.length === 0;

    const handleChatCreated = useCallback((user: ChatUser) => {
        setUsers((prev: ChatUser[]) => {
            if (!prev.find(u => u.id === user.id)) return [...prev, user];
            return prev;
        });

        setIsModalOpen(false);
        setSelectedUser(user);
    }, [setUsers, setSelectedUser]);

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">{t("header.messages")}</h1>
                <div className="flex gap-2">
                    <SearchInput
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg h-10 w-10 flex items-center justify-center shrink-0"
                        title={t("chat.writeMessage")}
                    >
                        <i className="fa fa-comment-dots text-lg"></i>
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="flex-1 min-h-0 overflow-y-auto p-2 custom-scroll"
            >
                {searching ? (
                    <div className="flex justify-center py-4">
                        <Loader />
                    </div>
                ) : noUsers ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <BlankData
                            icon="🔍"
                            title={searchQuery ? t("chat.noSearchResults") : t("chat.noUsers")}
                            message={searchQuery ? t("chat.tryAnotherSearch") : t("chat.noUsersHint")}
                            bordered={false}
                        />
                    </div>
                ) : (
                    <>
                        {users.map(user => (
                            <UserItem
                                key={user.id}
                                user={user}
                                isSelected={selectedUser?.id === user.id}
                                onClick={() => setSelectedUser(user)}
                            />
                        ))}

                        {loadingMore && <Loader />}

                        <InfiniteObserver
                            onIntersect={fetchMoreChats ?? (() => { })}
                            enabled={hasMore && !loadingMore}
                            root={containerRef.current}
                            rootMargin="100px"
                        />
                    </>
                )}
            </div>

            {currentUser && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ModalContentUsersList
                        fetchData={(offset, limit) => fetchUserFollowing(currentUser.id, offset, limit)}
                        title={t("chat.userSubscriptions")}
                        onChatCreated={handleChatCreated}
                    />
                </Modal>
            )}
        </div>
    );
};