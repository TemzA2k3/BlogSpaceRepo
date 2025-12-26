import { useEffect, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ChatMessage } from "@/components/ChatMessage";
import { BlankData } from "@/shared/components/BlankData";
import { InfiniteObserver } from "@/shared/components/InfiniteObserver";

import { formatDate, groupMessagesByDate } from "@/shared/utils/timeFormatter";

import type { ChatMessagesProps } from "@/shared/types/chat.types";

export const ChatMessages = ({
    messages,
    selectedUser,
    markMessageAsRead,
    fetchMoreMessages,
    hasMore
}: ChatMessagesProps) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef(messages.length);
    const prevScrollHeightRef = useRef(0);
    const lastMessageIdRef = useRef<string | number | null>(null);
    const isEmpty = messages.length === 0;

    const grouped = groupMessagesByDate(messages);

    useLayoutEffect(() => {
        if (containerRef.current) {
            prevScrollHeightRef.current = containerRef.current.scrollHeight;
        }
    });

    useLayoutEffect(() => {
        if (messages.length === 0) return;

        const currentLength = messages.length;
        const prevLength = prevMessagesLengthRef.current;

        if (prevLength === 0) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "auto",
                block: "end",
            });
        }

        else if (currentLength > prevLength && containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
            containerRef.current.scrollTop += scrollDiff;
        }

        prevMessagesLengthRef.current = currentLength;
    }, [messages.length]);

    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];

        if (lastMessage.id === lastMessageIdRef.current) return;

        lastMessageIdRef.current = lastMessage.id;

        if (lastMessage.sender === 'me') {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [messages]);

    useEffect(() => {
        prevMessagesLengthRef.current = 0;
        lastMessageIdRef.current = null;
        messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
        });
    }, [selectedUser?.id]);

    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto px-6 relative">
            {isEmpty ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <BlankData
                        icon="💬"
                        title={t("chat.noMessages")}
                        message={t("chat.noMessagesWithUser", { name: selectedUser?.firstName })}
                        bordered={false}
                        background={false}
                    />
                </div>
            ) : (
                <div className="space-y-6 mx-auto">
                    <InfiniteObserver
                        root={containerRef.current}
                        rootMargin="200px 0px 0px 0px"
                        onIntersect={fetchMoreMessages}
                        enabled={hasMore}
                    />
                    {Object.entries(grouped).map(([dateKey, msgs]) => (
                        <div key={dateKey}>
                            <div className="flex justify-center my-4">
                                <div className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                                    {formatDate(dateKey)}
                                </div>
                            </div>

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

                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};