import { type FC } from "react";

import type { ToggleProps } from "@/shared/types/toggler.types"

export const Toggle: FC<ToggleProps> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
            enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
    >
        <span
            className={`absolute top-1 right-[1.7rem] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
    </button>
);
