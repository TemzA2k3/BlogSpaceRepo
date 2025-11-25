import type { FC } from "react";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

interface ChatHeaderProps {
    firstName: string;
    lastName: string;
    avatar: string | null;
    online: boolean
}

export const ChatHeader: FC<ChatHeaderProps> = ({ firstName, lastName, avatar, online }) => {

    return (
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img
                        src={getAvatarUrl(firstName, lastName, avatar)}
                        alt={firstName}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full 
                            border-2 border-gray-50 dark:border-gray-800 
                            ${online ? 'bg-green-500' : 'bg-gray-400'}`}
                    />
                </div>
                <div>
                    <h2 className="font-semibold">{firstName + ' ' + lastName}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {online ? 'В сети' : 'Не в сети'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center">
                    <i className="fa fa-ellipsis-v" />
                </button>
            </div>
        </div>
    )
}
