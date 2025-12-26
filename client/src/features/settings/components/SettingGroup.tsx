import { type FC } from "react";

import type { SettingGroupProps } from "@/shared/types/settings.types"

export const SettingGroup: FC<SettingGroupProps> = ({ title, children }) => (
    <div className="mb-2">
        <div className="px-6 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {title}
            </span>
        </div>
        <div>{children}</div>
    </div>
);
