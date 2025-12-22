import { type FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import type { SuggestionsCardProps } from "@/shared/types/post.types"

export const SuggestionsCard: FC<SuggestionsCardProps> = ({ users }) => {
    const { t } = useTranslation();

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 bg-white dark:bg-darkbg">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">👥 {t('posts.suggestions')}</h4>
            <ul className="space-y-2 sm:space-y-3">
                {users.map(user => (
                    <li key={user.id} className="flex justify-between items-center">
                        <Link to={`/users/${user.id}`} className="flex items-center gap-2 sm:gap-3">
                            <img
                                src={getAvatarUrl(user.firstName, user.lastName, user.avatar)}
                                alt={user.username}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">
                                {user.username}
                            </span>
                        </Link>
                        <button className="text-blue-600 dark:text-blue-400 text-sm sm:text-base hover:underline">
                            {t('posts.follow')}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

