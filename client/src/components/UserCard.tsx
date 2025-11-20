import { type FC } from "react";
import { Link } from "react-router-dom";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { type UserCardProps } from "@/shared/types/userTypes";

interface UserCardWithMessageProps extends UserCardProps {
    showMessageButton?: boolean;
    onMessageClick?: (id: string | number) => void;
}

export const UserCard: FC<UserCardWithMessageProps> = ({
    id,
    firstName,
    lastName,
    userName,
    avatar,
    showMessageButton = false,
    onMessageClick,
}) => {
    return (
        <div className="relative flex items-center justify-between self-stretch min-h-16 px-4 py-2 bg-slate-50 dark:bg-darkbg gap-4 rounded-xl">
            <Link
                to={`/users/${id}`}
                className="flex items-center gap-4 flex-1"
            >
                <img
                    className="w-14 h-14 rounded-3xl object-cover"
                    src={getAvatarUrl(firstName, lastName, avatar)}
                    alt={userName}
                />
                <div className="flex flex-col justify-center items-start">
                    <div className="text-neutral-900 dark:text-gray-100 text-base font-medium leading-6">
                        {firstName} {lastName}
                    </div>
                    <div className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-5">
                        {userName}
                    </div>
                </div>
            </Link>

            {showMessageButton && (
                <button
                    onClick={() => onMessageClick?.(id)}
                    className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                >
                    Написать
                </button>
            )}
        </div>
    );
};
