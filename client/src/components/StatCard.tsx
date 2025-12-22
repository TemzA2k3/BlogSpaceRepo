import type { FC } from "react";

import type { StatCardProps } from "@/shared/types/user.types"

export const StatCard: FC<StatCardProps> = ({
    icon,
    title,
    value,
    change,
    color,
}) => {
    const changeColor =
        change === undefined
            ? ""
            : change > 0
                ? "text-green-600 dark:text-green-400"
                : change < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400";

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}
                        >
                            {icon}
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {title}
                        </h3>
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </span>

                        {change !== undefined && (
                            <span className={`text-sm font-medium mb-1 ${changeColor}`}>
                                {change > 0 ? "+" : ""}
                                {change}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
