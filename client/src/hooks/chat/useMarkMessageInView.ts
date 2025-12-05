import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { ChatMessage } from '@/shared/types/chat.types';

export const useMarkMessageInView = (
    msg: ChatMessage,
    markMessageAsRead?: (msg: ChatMessage) => void
) => {
    const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

    useEffect(() => {
        if (inView && msg.sender !== 'me' && !msg.isRead) {
            markMessageAsRead?.(msg);
        }
    }, [inView, msg, markMessageAsRead]);

    return ref;
};
