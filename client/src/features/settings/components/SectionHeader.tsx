import { type FC } from "react";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle }) => (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
    </div>
);
