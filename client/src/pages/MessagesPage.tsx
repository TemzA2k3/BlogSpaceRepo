import { useState, useEffect } from 'react';

import { UsersList } from '@/components/UsersList';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';

import { BlankData } from '@/shared/components/BlankData';

import { getAllChats } from "@/shared/services/fetchUserChats";

import type { ChatUser, ChatMessage } from '@/shared/types/chat.types';

export const MessagesPage = () => {
    const [usersList, setUsersList] = useState<ChatUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log(selectedUser);
    

    const fetchChats = async () => {
        try {
            setLoading(true);
            const data = await getAllChats();
            setUsersList(data || []);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ошибка при загрузке чатов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const filteredUsers = usersList.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentMessages = selectedUser ? messages[selectedUser.id] || [] : [];
    const noUsersFound = filteredUsers.length === 0;

    if (loading) {
        return <div className="flex items-center justify-center h-full">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-auto w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <UsersList
                users={filteredUsers}
                setUsers={setUsersList}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="flex-1 flex flex-col relative">
                {noUsersFound || !selectedUser ? (
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
                        <ChatInput />
                    </>
                )}
            </div>
        </div>
    );
};
