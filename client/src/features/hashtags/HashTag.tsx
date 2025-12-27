import { type FC } from "react";

import type { HashTagProps } from "@/shared/types/hashtag.types"

export const HashTag: FC<HashTagProps> = ({ tag, onRemove }) => {
    return (
        <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2 border border-blue-200 dark:border-blue-800">
            <i className="fa fa-tag text-xs"></i>
            {tag}
            <button
                onClick={onRemove}
                className="ml-1 text-blue-600 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400 text-sm transition"
            >
                ×
            </button>
        </span>
    )
}
