import { type FC, useState } from "react";
import { EmojiPicker } from "@/shared/components/EmojiPicker";
import { CommentItem } from "@/components/CommentItem";

import type { CommentsSectionProps } from "@/shared/types/comment.types";

export const CommentsSection: FC<CommentsSectionProps> = ({
    comments,
    onLoadMoreComments,
    onSubmitComment,
}) => {
    const [newComment, setNewComment] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const handleEmojiSelect = (emoji: string) => setNewComment(prev => prev + emoji);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        await onSubmitComment(newComment);
        setNewComment("");
    };

    return (
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-10 transition-colors duration-300 mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Comments</h2>

            <div className="space-y-6 mb-6">
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onSubmitReply={onSubmitComment}
                    />
                ))}
            </div>

            {(onLoadMoreComments || true) && (
                <div className="mb-6 text-center">
                    <button
                        onClick={onLoadMoreComments}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Show more comments
                    </button>
                </div>
            )}

            <div className="relative">
                <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                />
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    className="absolute right-3 bottom-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                >
                    <i className="fa fa-smile text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"></i>
                </button>

                <EmojiPicker
                    show={showEmojiPicker}
                    onSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                />
            </div>

            <div className="mt-2 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Submit
                </button>
            </div>
        </section>
    );
};
