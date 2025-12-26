import { type FC, useRef } from "react";

import { useAppSelector } from "@/hooks/redux/reduxHooks";
import { useMessageAvatar } from '@/hooks/chat/useMessageAvatar';
import { useIsSingleLine } from '@/hooks/chat/useIsSingleLine';
import { useMarkMessageInView } from '@/hooks/chat/useMarkMessageInView';

import { formatTime } from "@/shared/utils/timeFormatter";

import type { ChatMessageProps } from "@/shared/types/chat.types";

export const ChatMessage: FC<ChatMessageProps> = ({ msg, selectedUser, markMessageAsRead }) => {
    const { currentUser } = useAppSelector(state => state.auth);
    const textRef = useRef<HTMLParagraphElement>(null);

    const { avatarSrc, avatarAlt } = useMessageAvatar(msg, currentUser, selectedUser);
    const isSingleLine = useIsSingleLine(textRef, msg.text);
    const ref = useMarkMessageInView(msg, markMessageAsRead);

    return (
        <div ref={ref} className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
            {msg.sender !== 'me' && (
                <img src={avatarSrc} alt={avatarAlt} className="h-8 w-8 rounded-full object-cover mr-2" />
            )}

            <div className={`relative max-w-[50%] rounded-2xl px-4 py-2 break-words flex flex-col bg-${msg.sender === 'me' ? 'blue-600 text-white' : 'gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}>
                <p ref={textRef} className="text-sm leading-relaxed">{msg.text}</p>

                <div className={`text-xs mt-1 ${isSingleLine ? 'inline-flex items-center' : 'absolute bottom-1 flex items-center'} ${msg.sender === 'me' ? 'self-end right-2' : 'left-2'}`}>
                    <span>{formatTime(msg.time)}</span>
                    {msg.sender === 'me' && (
                        <span className="relative w-4 h-4">
                            <i className={`fa fa-check text-white absolute bottom-0 ${msg.isRead ? "right-[3px]" : "right-0"}`}></i>
                            {msg.isRead && <i className="fa fa-check absolute bottom-0 right-0 text-white"></i>}
                        </span>
                    )}
                </div>
            </div>

            {msg.sender === 'me' && (
                <img src={avatarSrc} alt={avatarAlt} className="h-8 w-8 rounded-full object-cover ml-2" />
            )}
        </div>
    );
};
