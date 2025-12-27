import { type FC } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import type { CreatePostSectionProps } from "@/shared/types/post.types"

export const CreatePostSection: FC<CreatePostSectionProps> = ({ firstName, lastName, avatar, userName }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div
            onClick={() => navigate("create")}
            className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm px-4 py-3 cursor-pointer hover:shadow-md transition-all duration-200"
        >
            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                <img
                    className="w-full h-full"
                    src={getAvatarUrl(firstName, lastName, avatar)}
                    alt={userName}
                />
            </div>

            <div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full truncate whitespace-nowrap text-gray-500 dark:text-gray-400">
                {t('posts.whatsNew')}
            </div>

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow transition-colors duration-150"
            >
                {t('posts.writeSmth')}
            </button>
        </div>
    )
}