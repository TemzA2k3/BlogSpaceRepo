import { type FC } from "react";

interface Comment {
    id: number;
    author: string;
    date: string;
    content: string;
    indent?: boolean;
}

interface CommentsSectionProps {
    comments: Comment[];
}

export const CommentsSection: FC<CommentsSectionProps> = ({ comments }) => {
    return (
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 sm:p-10 transition-colors duration-300 mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Comments</h2>
            <div className="space-y-6">
                {comments.map(comment => (
                    <div key={comment.id} className={`flex gap-4 ${comment.indent ? 'ml-12' : ''}`}>
                        <i className="fa-regular fa-user w-10 h-10 text-gray-500 dark:text-gray-400 text-3xl"></i>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{comment.author}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
