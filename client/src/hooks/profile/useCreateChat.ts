import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAlert } from "@/app/providers/alert/AlertProvider";

import { createChat as createChatService } from "@/shared/services/createChat";

import type { ChatUser } from "@/shared/types/chat.types";

export const useCreateChat = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleMessageClick = async (
        targetUserId: number | null,
        currentUserId: number | undefined
    ) => {
        if (!targetUserId) return;

        if (!currentUserId) {
            navigate("/signin");
            return;
        }

        try {
            const newChat: ChatUser = await createChatService(targetUserId);
            navigate(`/messages?chat_id=${newChat.chatId}`);
        } catch (err: any) {
            console.error(t("chat.createChatError"), err);
            showAlert(err.message || t("chat.createChatError"), "error");
        }
    };

    return { handleMessageClick };
};