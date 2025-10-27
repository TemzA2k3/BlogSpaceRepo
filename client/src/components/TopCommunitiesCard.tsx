import { type FC } from "react";

interface Community {
    id: number;
    name: string;
    members: number;
    avatar?: string;
}

interface TopCommunitiesCardProps {
    communities: Community[];
}

export const TopCommunitiesCard: FC<TopCommunitiesCardProps> = ({ communities }) => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 bg-white dark:bg-darkbg">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">🏘️ Top Communities</h4>
            <ul className="space-y-2 sm:space-y-3">
                {communities.map(c => (
                    <li key={c.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <img
                                src={c.avatar || "https://placehold.co/40x40"}
                                alt={c.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                                    {c.name}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    {c.members} members
                                </div>
                            </div>
                        </div>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <i className="fas fa-plus text-gray-700 dark:text-gray-100"></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

