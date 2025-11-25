import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { BlankData } from "@/shared/components/BlankData";

interface ChatMessagesProps {
    messages: any[];
    selectedUser: any;
}

export const ChatMessages = ({ messages, selectedUser }: ChatMessagesProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage?.sender === 'me') {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const isEmpty = messages.length === 0;

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
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} msg={msg} selectedUser={selectedUser} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};
