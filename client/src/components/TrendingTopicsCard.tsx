import { type FC } from "react";
import { useTranslation } from "react-i18next";

interface TrendingTopic {
    tag: string;
    count: number;
}

interface TrendingTopicsCardProps {
    topics: TrendingTopic[];
}

export const TrendingTopicsCard: FC<TrendingTopicsCardProps> = ({ topics }) => {
    const { t } = useTranslation();

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-5 bg-white dark:bg-darkbg">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">🔥 {t('posts.trendingTopics')}</h4>
            <ul className="space-y-2 sm:space-y-3">
                {topics.map(topic => (
                    <li
                        key={topic.tag}
                        className="flex justify-between items-center text-sm sm:text-base text-gray-700 dark:text-gray-300"
                    >
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{topic.tag}</span>
                        <span className="text-gray-500 dark:text-gray-400">{topic.count} {t('posts.posts')}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

