import { useState, useCallback } from 'react';

import { useAppSelector } from '@/hooks/reduxHooks';

import { UserItem } from './UserItem';
import { SearchInput } from './SearchInput';
import { ModalContentUsersList } from './ModalContentUsersList';

import { BlankData } from '@/shared/components/BlankData';
import { Modal } from '@/shared/components/Modal';

import { fetchUserFollowing } from '@/shared/services/fetchUserSubs';

import { getAvatarUrl } from '@/shared/utils/getImagesUrls';

import type { ChatUser } from '@/shared/types/chat.types';

interface UsersListProps {
    users: ChatUser[];
    setUsers: React.Dispatch<React.SetStateAction<ChatUser[]>>;
    selectedUser: ChatUser | null;
    setSelectedUser: (user: ChatUser) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }

export const UsersList: React.FC<UsersListProps> = ({
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    searchQuery,
    setSearchQuery,
}) => {
    const { currentUser } = useAppSelector(state => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const noUsers = users.length === 0;

    const handleChatCreated = useCallback((user: ChatUser) => {
        const newUser: ChatUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: getAvatarUrl(user.firstName, user.lastName, user.avatar),
            lastMessage: null,
            time: null,
            unread: 0,
            online: false,
        };

        setUsers((prev: ChatUser[]) => {
            if (!prev.find(u => u.id === newUser.id)) return [...prev, newUser];
            return prev;
        });


        setIsModalOpen(false);

        setSelectedUser(newUser);
    }, [setUsers]);


    return (
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Сообщения</h1>
                <div className="flex gap-2">
                    <SearchInput
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg h-10 w-10 flex items-center justify-center shrink-0"
                        title="Написать сообщение"
                    >
                        <i className="fa fa-comment-dots text-lg"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-2">
                {noUsers ? (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <BlankData
                            icon="🔍"
                            title="Нет пользователей"
                            message="Попробуйте изменить запрос поиска."
                            bordered={false}
                        />
                    </div>
                ) : (
                    users.map(user => (
                        <UserItem
                            key={user.id}
                            user={user}
                            isSelected={selectedUser?.id === user.id}
                            onClick={() => setSelectedUser(user)}
                        />
                    ))
                )}
            </div>

            {currentUser && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ModalContentUsersList
                        fetchData={() => fetchUserFollowing(currentUser.id)}
                        title="Подписки пользователя"
                        onChatCreated={handleChatCreated}
                    />
                </Modal>
            )}
        </div>
    );
};
