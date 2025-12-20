import { useEffect, useLayoutEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { BlankData } from "@/shared/components/BlankData";

import { formatDate, groupMessagesByDate } from "@/shared/utils/timeFormatter";

import type { ChatMessage as ChatMessageType, ChatUser } from "@/shared/types/chat.types";

interface ChatMessagesProps {
    messages: ChatMessageType[];
    selectedUser: ChatUser;
    markMessageAsRead?: (msg: ChatMessageType) => void;
}

export const ChatMessages = ({
    messages,
    selectedUser,
    markMessageAsRead
}: ChatMessagesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isEmpty = messages.length === 0;

    const grouped = groupMessagesByDate(messages);

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end"
        });
    }, [selectedUser?.id]);

    useEffect(() => {
        if (messages.length === 0) return;
    
        const lastMessage = messages[messages.length - 1];
    
        if (lastMessage.sender !== 'me') return;
    
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, [messages]);

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto px-6 relative">
            {isEmpty ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <BlankData
                        icon="💬"
                        title="Нет сообщений"
                        message={`Вы ещё не переписывались с ${selectedUser?.firstName}.`}
                        bordered={false}
                        background={false}
                    />
                </div>
            ) : (
                <div className="space-y-6 mx-auto">
                    {Object.entries(grouped).map(([dateKey, msgs]) => (
                        <div key={dateKey}>
                            {/* Плашка даты */}
                            <div className="flex justify-center my-4">
                                <div className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                                    {formatDate(dateKey)}
                                </div>
                            </div>

                            {/* Сообщения конкретного дня */}
                            <div className="space-y-4">
                                {msgs.map(msg => (
                                    <ChatMessage
                                        key={msg.id}
                                        msg={msg}
                                        selectedUser={selectedUser}
                                        markMessageAsRead={markMessageAsRead}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Конечный реф для скролла */}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};
