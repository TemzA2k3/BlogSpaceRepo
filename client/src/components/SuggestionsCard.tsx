import { type FC } from "react";
import { useTranslation } from "react-i18next";

interface SuggestedUser {
    id: number;
    name: string;
    avatar?: string;
}

interface SuggestionsCardProps {
    users: SuggestedUser[];
}

export const SuggestionsCard: FC<SuggestionsCardProps> = ({ users }) => {
    const { t } = useTranslation();

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 bg-white dark:bg-darkbg">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">👥 {t('posts.suggestions')}</h4>
            <ul className="space-y-2 sm:space-y-3">
                {users.map(user => (
                    <li key={user.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <img
                                src={user.avatar || "https://placehold.co/40x40"}
                                alt={user.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                            <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">
                                @{user.name}
                            </span>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 text-sm sm:text-base hover:underline">
                            {t('posts.follow')}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

