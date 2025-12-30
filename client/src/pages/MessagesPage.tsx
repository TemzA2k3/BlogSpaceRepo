import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { useSocketContext } from '@/app/providers/socket/index';
import { useAlert } from '@/app/providers/alert/AlertProvider';

import { UsersList } from '@/features/chat/UsersList';
import { ChatHeader } from '@/features/chat/ChatHeader';
import { ChatMessages } from '@/features/chat/ChatMessages';
import { ChatInput } from '@/features/chat/ChatInput';
import { Loader } from '@/shared/components/Loader';
import { BlankData } from '@/shared/components/BlankData';

import { useChats } from '@/hooks/chat/useChats';
import { useChatMessages } from '@/hooks/chat/useChatMessages';
import { useChatSocket } from '@/hooks/chat/useChatSocket';
import { useMessageSocket } from '@/hooks/chat/useMessageSocket';
import { useTypingStatus } from '@/hooks/chat/useTypingStatus';

export const MessagesPage = () => {
    const { t } = useTranslation();
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
            showAlert(t("chat.chatDeleted"), "success");
        } catch (err: any) {
            showAlert(err.message || t("chat.chatDeleteError"), "error");
        }
    };

    const handleBack = () => {
        handleSelectUser(null);
    };

    if (loading) return <Loader />;

    return (
        <div className="flex h-auto w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className={`
                ${selectedUser ? 'hidden md:flex' : 'flex'} 
                w-full md:w-80 
                border-r border-gray-200 dark:border-gray-700 
                flex-col bg-gray-50 dark:bg-gray-800
            `}>
                <UsersList
                    users={filteredUsers}
                    setUsers={setUsersList}
                    selectedUser={selectedUser}
                    setSelectedUser={handleSelectUser}
                    searchQuery=""
                    setSearchQuery={() => { }}
                />
            </div>

            <div className={`
                ${selectedUser ? 'flex' : 'hidden md:flex'} 
                flex-1 flex-col relative h-[calc(100vh-64px)]
            `}>
                {!selectedUser || !filteredUsers.length ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BlankData
                            icon="💬"
                            title={t("chat.noChats")}
                            message={t("chat.noChatsHint")}
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
                            onBack={handleBack}
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