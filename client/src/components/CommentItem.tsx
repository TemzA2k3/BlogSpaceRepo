import { type FC, useState } from "react";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { formatRelativeDate } from "@/shared/utils/timeFormatter";

import type { CommentItemProps } from "@/shared/types/comment.types";

export const CommentItem: FC<CommentItemProps> = ({
    comment,
    onSubmitReply,
    onLoadReplies
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleCancel = () => {
        setIsReplying(false);
        setReplyText("");
    };

    const handleSubmit = async () => {
        if (!replyText.trim()) return;

        const created = await onSubmitReply(replyText, comment.id);
        if (!created) return;

        handleCancel();
    };

    return (
        <div className="group">
            {/* Основной комментарий */}
            <div className={`flex gap-4 ${comment.indent ? "ml-16" : ""}`}>
                <img
                    src={getAvatarUrl(
                        comment.firstName,
                        comment.lastName,
                        comment.avatar
                    )}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                />

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                            {comment.firstName + " " + comment.lastName}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeDate(comment.date)}
                        </span>

                        {/* Ответить */}
                        {!comment.indent && (
                            <button
                                onClick={() => setIsReplying(true)}
                                className="text-xs text-blue-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Ответить
                            </button>
                        )}

                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comment.content}
                    </p>

                    {/* Форма ответа */}
                    {isReplying && (
                        <div className="mt-3">
                            <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                rows={2}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Написать ответ..."
                            />

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleSubmit}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Отправить
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Отмена
                                </button>

                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Рекурсивный рендер ответов */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onSubmitReply={onSubmitReply}
                            onLoadReplies={onLoadReplies}
                        />
                    ))}

                    {!comment.indent &&
                        comment.repliesCount &&
                        comment.replies.length < comment.repliesCount && (
                            <div className="ml-16 mt-1">
                                <button
                                    onClick={() => onLoadReplies?.(comment.id)}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Посмотреть еще {comment.repliesCount - 3} ответа
                                </button>
                            </div>
                        )}
                </div>
            )}

        </div>
    );
};
