import { useChatInput } from "@/hooks/chat/useChatInput";
import { useTyping } from "@/hooks/chat/useTyping";

import type { ChatInputProps } from "@/shared/types/chat.types";

export const ChatInput = ({ onSend, socket, currentUserId, selectedUserId }: ChatInputProps) => {
    const { text, setText, handleSend, handleKeyDown } = useChatInput({
        socket,
        currentUserId,
        selectedUserId,
        onSend,
    });

    useTyping({ text, socket, currentUserId, selectedUserId });

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="mx-auto flex items-end gap-2">
                <input
                    type="text"
                    placeholder="Написать сообщение..."
                    className="flex-1 min-h-[44px] rounded-xl bg-gray-100 dark:bg-gray-700 px-4 py-2 border-none focus:outline-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                    onClick={handleSend}
                >
                    <i className="fa fa-paper-plane" />
                </button>
            </div>
        </div>
    );
};
