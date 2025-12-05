import { useLayoutEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { BlankData } from "@/shared/components/BlankData";
import type { ChatMessage as ChatMessageType } from "@/shared/types/chat.types";

interface ChatMessagesProps {
    messages: ChatMessageType[];
    selectedUser: any;
    markMessageAsRead?: (msg: ChatMessageType) => void;
}

export const ChatMessages = ({
    messages,
    selectedUser,
    markMessageAsRead
}: ChatMessagesProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isEmpty = messages.length === 0;

    const prevMessagesRef = useRef<ChatMessageType[]>([]);

    useLayoutEffect(() => {
        const lastCurrent = messages[messages.length - 1];

        if (lastCurrent && lastCurrent.sender === 'me') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }

        prevMessagesRef.current = messages;
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-6 relative">
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
                <div className="space-y-4 mx-auto">
                    {messages.map(msg => (
                        <ChatMessage
                            key={msg.id}
                            msg={msg}
                            selectedUser={selectedUser}
                            markMessageAsRead={markMessageAsRead}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};
