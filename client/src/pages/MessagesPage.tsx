import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from '@/hooks/reduxHooks';
import { useSocket } from '@/hooks/useSocket';
import { useAlert } from '@/app/providers/alert/AlertProvider';

import { UsersList } from '@/components/UsersList';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { Loader } from '@/shared/components/Loader';

import { BlankData } from '@/shared/components/BlankData';

import { getAllChats } from "@/shared/services/fetchUserChats";
import { getChatNesasges } from "@/shared/services/getChatMessages"

import type { ChatUser, ChatMessage } from '@/shared/types/chat.types';


export const MessagesPage = () => {
    const { currentUser } = useAppSelector(state => state.auth)
    const { showAlert } = useAlert();
    const [searchParams, setSearchParams] = useSearchParams();

    // const socket = useSocket(currentUser?.id ?? null);

    const [usersList, setUsersList] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    const filteredUsers = usersList.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentMessages = selectedUser ? messages[selectedUser.chatId] || [] : [];
    const noUsersFound = filteredUsers.length === 0;

    const fetchChats = async () => {
        try {
            setLoading(true);
            const data = await getAllChats();
            setUsersList(data || []);
        } catch (err: any) {
            setError(err.message || "Ошибка при загрузке чатов");
        } finally {
            setLoading(false);
        }
    };

    const fetchMessagesForCurrentChat = async (chatId: number) => {
        if (!selectedUser) return

        try {
            const data = await getChatNesasges(chatId);
            console.log(data);
            
            setMessages(prev => ({
                ...prev,
                [selectedUser.chatId]: data
            }));
        } catch (err: any) {
            showAlert(err.message || "Ошибка загрузки сообщений", "error");
        }
    }

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
    
        const chatId = selectedUser.chatId;
    
        if (messages[chatId]) return;
    
        fetchMessagesForCurrentChat(chatId);
    }, [selectedUser]);

    useEffect(() => {
        if (!error) return;

        showAlert(error, "error");
    }, [error]);

    useEffect(() => {
        setSelectedUser(usersList[0])
    }, [usersList])


    const handleSelectUser = (user: ChatUser) => {
        setSelectedUser(user);
        setSearchParams({ chat_id: String(user.chatId) });
    };


    useEffect(() => {
        if (!usersList.length) return;

        const chatId = searchParams.get("chat_id");
        if (!chatId) return;

        const found = usersList.find(u => u.chatId === Number(chatId));
        if (found) setSelectedUser(found);
    }, [usersList, searchParams]);


    if (loading) return <Loader />;

    return (
        <div className="flex h-auto w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <UsersList
                users={filteredUsers}
                setUsers={setUsersList}
                selectedUser={selectedUser}
                setSelectedUser={handleSelectUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="flex-1 flex flex-col relative">
                {(noUsersFound || !selectedUser) ? (
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
                            online={selectedUser.online}
                        />
                        <ChatMessages messages={currentMessages} selectedUser={selectedUser} />
                        <ChatInput onSend={() => console.log('123')} />
                    </>
                )}
            </div>
        </div>
    );
};