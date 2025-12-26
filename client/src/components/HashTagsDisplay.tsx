import { type FC } from "react";

import type { HashTagsDisplayProps } from "@/shared/types/hashtag.types";

export const HashTagsDisplay: FC<HashTagsDisplayProps> = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
                <span
                    key={tag.id || tag.name}
                    className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer"
                >
                    #{tag.name}
                </span>
            ))}
        </div>
    );
};
