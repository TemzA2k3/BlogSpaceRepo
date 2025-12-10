import { type FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/shared/utils/getImagesUrls";
import { formatDate } from "@/shared/utils/timeFormatter";
import type { UsersPosts } from "@/shared/types/post.types";
import { usePostCard } from "@/hooks/posts/usePostCard";

interface PostCardProps extends UsersPosts {
    onPostUpdate?: (updatedPost: UsersPosts | null) => void;
    onPostDelete?: (postId: number) => void;
}

export const PostCard: FC<PostCardProps> = ({ onPostUpdate, onPostDelete, ...post }) => {
    const { t } = useTranslation();
    const {
        showDropdown,
        setShowDropdown,
        dropdownRef,
        handleToggleLike,
        handleDeletePost,
        handleToggleSave,
        currentUser,
    } = usePostCard(post, onPostUpdate, onPostDelete);

    return (
        <div className="relative self-stretch px-5 py-4 bg-slate-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-2xl flex justify-start items-start gap-4 shadow-sm hover:shadow-md transition-all duration-200">
            {/* Dropdown */}
            <div className="absolute top-3 right-3" ref={dropdownRef}>
                <button onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <i className="fas fa-ellipsis-h"></i>
                </button>
                {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 min-w-[140px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <ul className="flex flex-col">
                            <li className="w-full text-left px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                                <i className="fas fa-flag text-xs sm:text-sm"></i> Пожаловаться
                            </li>
                            {currentUser?.id === post.userId && (
                                <li onClick={handleDeletePost}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700 cursor-pointer flex items-center gap-2">
                                    <i className="fas fa-trash-alt text-xs sm:text-sm"></i> Удалить
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Avatar */}
            <img className="w-16 h-16 rounded-full object-cover" src={post.avatar} alt={`${post.firstName} ${post.lastName}`} />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col">
                        <Link to={`/users/${post.userId}`} className="w-fit text-neutral-900 dark:text-gray-100 text-[17px] font-semibold leading-snug">
                            {post.firstName} {post.lastName}
                        </Link>
                        <div className="w-fit text-slate-500 dark:text-gray-400 text-sm font-normal">{post.username}</div>
                    </div>

                    {post.content && <div className="text-slate-700 dark:text-gray-300 text-[15px] font-normal leading-relaxed mt-2 whitespace-pre-wrap">{post.content}</div>}
                    {post.image && <img className="w-full mt-2 rounded-xl object-cover" src={getImageUrl(post.image)} alt="Post image" />}
                    {post.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {post.hashtags.map(tag => (
                                <span key={tag.id || tag.name} className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer">#{tag.name}</span>
                            ))}
                        </div>
                    )}

                    <div className="text-slate-400 dark:text-gray-500 text-sm font-normal mt-2 italic">
                        {t('posts.published')} {formatDate(post.createdAt)}
                    </div>
                </div>

                {/* Bottom panel */}
                <div className="flex justify-start items-center gap-6 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* Like */}
                    {/* Likes */}
                    <div
                        onClick={handleToggleLike}
                        className={`flex items-center gap-2 text-sm cursor-pointer transition-colors 
                                    ${post.likedByCurrentUser ? 'text-red-500' : 'text-slate-600 dark:text-gray-400'}
                                    hover:text-red-500 dark:hover:text-red-400`}
                    >
                        <i className={`far fa-heart ${post.likedByCurrentUser ? 'fas' : ''}`}></i>
                        <span>{post.likes}</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-2 text-slate-600 
                                    dark:text-gray-400 text-sm 
                                    hover:text-blue-500 dark:hover:text-blue-400 
                                    transition-colors cursor-pointer"
                    >
                        <i className="far fa-comment"></i>
                        <span>{post.comments}</span>
                    </div>

                    {/* Save */}
                    <div
                        onClick={handleToggleSave}
                        className={`flex items-center gap-2 text-sm cursor-pointer transition-colors 
                                    ${post.savedByCurrentUser ? 'text-yellow-500' : 'text-slate-600 dark:text-gray-400'}
                                    hover:text-yellow-500 dark:hover:text-yellow-400`}
                    >
                        <i className={`far fa-bookmark ${post.savedByCurrentUser ? 'fas' : ''}`}></i>
                        <span>{post.saved}</span>
                    </div>

                </div>
            </div>
        </div>
    );
};
