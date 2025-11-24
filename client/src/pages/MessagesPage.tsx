import { useState, useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { useSocket } from '@/hooks/sockets/useSocket';

import { UsersList } from '@/components/UsersList';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { Loader } from '@/shared/components/Loader';
import { BlankData } from '@/shared/components/BlankData';

import { useChats } from '@/hooks/chat/useChats';
import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useChatSocket } from '@/hooks/chat/useChatSocket';

export const MessagesPage = () => {
    const { currentUser } = useAppSelector(state => state.auth);
    const socket = useSocket(currentUser?.id ?? null);

    const { usersList, selectedUser, loading, setUsersList, handleSelectUser } = useChats(socket, currentUser?.id ?? null);;
    const { messages, setMessages } = useChatMessages(selectedUser);
    const { sendMessage } = useChatSocket({ socket, currentUserId: currentUser?.id ?? null, selectedUser, setMessages, setUsersList });

    const filteredUsers = useMemo(
        () =>
            usersList.filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes('')
            ),
        [usersList]
    );

    const currentMessages = useMemo(() => (selectedUser ? messages[selectedUser.chatId] || [] : []), [
        selectedUser,
        messages,
    ]);

    if (loading) return <Loader />;

    return (
        <div className="flex h-auto w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <UsersList
                users={filteredUsers}
                setUsers={setUsersList}
                selectedUser={selectedUser}
                setSelectedUser={handleSelectUser}
                searchQuery=""
                setSearchQuery={() => { }}
            />

            <div className="flex-1 flex flex-col relative"
                 style={{ height: 'calc(100vh - 64px)' }}>
                {!selectedUser || !filteredUsers.length ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BlankData icon="💬" title="Нет переписок" message="Выберите пользователя слева, чтобы начать диалог." bordered={false} />
                    </div>
                ) : (
                    <>
                        <ChatHeader firstName={selectedUser.firstName} lastName={selectedUser.lastName} avatar={selectedUser.avatar} online={selectedUser.online} />
                        <ChatMessages messages={currentMessages} selectedUser={selectedUser} />
                        <ChatInput onSend={sendMessage} />
                    </>
                )}
            </div>
        </div>
    );
};