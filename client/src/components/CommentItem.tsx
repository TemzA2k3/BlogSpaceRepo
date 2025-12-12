import { type FC } from "react";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { formatRelativeDate } from "@/shared/utils/timeFormatter"

import type { CommentItemProps } from "@/shared/types/comment.types";

export const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  return (
    <div>
      {/* Основной комментарий */}
      <div className={`flex gap-4 ${comment.indent ? "ml-[3rem]" : ""}`}>
        <img 
            src={getAvatarUrl(comment.firstName, comment.lastName, comment.avatar)}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
         />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.firstName + " " + comment.lastName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeDate(comment.date)}</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>

      {/* Рекурсивный рендер ответов */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};
