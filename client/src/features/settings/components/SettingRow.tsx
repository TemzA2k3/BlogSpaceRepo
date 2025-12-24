import { type FC, type ReactNode } from "react";

interface SettingRowProps {
    label: string;
    description?: string;
    children: ReactNode;
}

export const SettingRow: FC<SettingRowProps> = ({ label, description, children }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="flex-1 mr-4">
            <span className="text-gray-800 dark:text-gray-200 font-medium">{label}</span>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {description}
                </p>
            )}
        </div>
        {children}
    </div>
);
