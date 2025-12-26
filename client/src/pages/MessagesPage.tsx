import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { useSocketContext } from '@/app/providers/socket/index';
import { useAlert } from '@/app/providers/alert/AlertProvider';

import { UsersList } from '@/components/UsersList';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { Loader } from '@/shared/components/Loader';
import { BlankData } from '@/shared/components/BlankData';

import { useChats } from '@/hooks/chat/useChats';
import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useChatSocket } from '@/hooks/chat/useChatSocket';
import { useMessageSocket } from '@/hooks/chat/useMessageSocket';
import { useTypingStatus } from '@/hooks/chat/useTypingStatus';


export const MessagesPage = () => {
    const { currentUser } = useAppSelector(state => state.auth);
    const { socket, usersStatus } = useSocketContext();
    const { showAlert } = useAlert();

    const {
        usersList,
        selectedUser,
        loading,
        deleting,
        setUsersList,
        handleSelectUser,
        handleDeleteChat,
    } = useChats(socket, currentUser?.id ?? null);

    const { 
        messages,
        setMessages,
        fetchMoreMessages,
        hasMore,
        // loading,
    } = useChatMessages(selectedUser);

    const { sendMessage } = useChatSocket({
        socket,
        currentUserId: currentUser?.id ?? null,
        selectedUser,
        setMessages,
        setUsersList
    });
    const { markMessageAsRead } = useMessageSocket({
        socket,
        currentUserId: currentUser?.id ?? null,
        selectedChatId: selectedUser?.chatId ?? null,
        setMessages,
    });

    useTypingStatus({ socket, setUsersList });

    const filteredUsers = useMemo(() =>
        usersList.filter(user => `${user.firstName} ${user.lastName}`.toLowerCase().includes('')),
        [usersList]
    );

    const currentMessages = useMemo(() =>
        selectedUser ? messages[selectedUser.chatId] || [] : [],
        [selectedUser, messages]
    );

    const onDeleteChat = async () => {
        try {
            await handleDeleteChat();
            showAlert("Чат удален", "success");
        } catch (err: any) {
            showAlert(err.message || "Не удалось удалить чат", "error");
        }
    };


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

            <div className="flex-1 flex flex-col relative h-[calc(100vh-64px)]">
                {!selectedUser || !filteredUsers.length ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BlankData
                            icon="💬"
                            title="Нет переписок"
                            message="Выберите пользователя слева, чтобы начать диалог."
                            bordered={false}
                        />
                    </div>
                ) : (
                    <>
                        <ChatHeader
                            firstName={selectedUser.firstName}
                            lastName={selectedUser.lastName}
                            avatar={selectedUser.avatar}
                            online={usersStatus[selectedUser.id] ?? false}
                            typing={selectedUser.typing}
                            onDeleteChat={onDeleteChat}
                            deleting={deleting}
                        />

                        <ChatMessages
                            messages={currentMessages}
                            selectedUser={selectedUser}
                            markMessageAsRead={markMessageAsRead}
                            fetchMoreMessages={fetchMoreMessages}
                            hasMore={hasMore}
                        />

                        <ChatInput
                            onSend={sendMessage}
                            socket={socket}
                            currentUserId={currentUser?.id ?? null}
                            selectedUserId={selectedUser?.id ?? null}
                        />
                    </>
                )}
            </div>
        </div>
    );
};