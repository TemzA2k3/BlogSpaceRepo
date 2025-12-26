import { type FC } from "react";

import type { SelectButtonProps } from "@/shared/types/settings.types"

export const SelectButton: FC<SelectButtonProps> = ({ value, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
        <span>{value}</span>
        <i className="fa-solid fa-chevron-right text-sm" />
    </button>
);
