import { type FC, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "@/hooks/reduxHooks";
import { getImageUrl } from "@/shared/utils/getImagesUrls";
import type { PostCardProps } from "@/shared/types/postTypes";

export const PostCard: FC<PostCardProps> = ({
    userId,
    avatar,
    firstName,
    lastName,
    username,
    content,
    image,
    hashtags,
    date,
    likes,
    comments,
    saved,
}) => {
    const { currentUser } = useAppSelector(state => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const formattedDate = new Date(date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // Закрытие дропдауна при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative self-stretch px-5 py-4 bg-slate-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-2xl flex justify-start items-start gap-4 shadow-sm hover:shadow-md transition-all duration-200">

            {/* Дропдаун кнопка справа сверху */}
            <div className="absolute top-3 right-3" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <i className="fas fa-ellipsis-h"></i>
                </button>

                {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 min-w-[140px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        <ul className="flex flex-col">
                            <li className="w-full text-left px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                                <i className="fas fa-flag text-xs sm:text-sm"></i>
                                Пожаловаться
                            </li>
                            {currentUser?.id === userId && (
                                <li className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700 cursor-pointer flex items-center gap-2">
                                    <i className="fas fa-trash-alt text-xs sm:text-sm"></i>
                                    Удалить
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Аватар */}
            <img
                className="w-16 h-16 rounded-full object-cover"
                src={avatar}
                alt={`${firstName} ${lastName}`}
            />

            {/* Контент */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-1">
                    {/* Имя и юзернейм */}
                    <div className="flex flex-col">
                        <Link
                            to={`/users/${userId}`} 
                            className="text-neutral-900 dark:text-gray-100 text-[17px] font-semibold leading-snug">
                            {firstName} {lastName}
                        </Link>
                        <div className="text-slate-500 dark:text-gray-400 text-sm font-normal">
                            {username}
                        </div>
                    </div>

                    {/* Контент поста */}
                    {content && (
                        <div className="text-slate-700 dark:text-gray-300 text-[15px] font-normal leading-relaxed mt-2 whitespace-pre-wrap">
                            {content}
                        </div>
                    )}

                    {/* Изображение */}
                    {image && (
                        <img
                            className="w-full mt-2 rounded-xl object-cover"
                            src={getImageUrl(image)}
                            alt="Post image"
                        />
                    )}

                    {/* Хэштеги */}
                    {hashtags && hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {hashtags.map((tag) => (
                                <span
                                    key={tag.id || tag.name}
                                    className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Дата */}
                    <div className="text-slate-400 dark:text-gray-500 text-sm font-normal mt-2 italic">
                        Опубликовано {formattedDate}
                    </div>
                </div>

                {/* Нижняя панель */}
                <div className="flex justify-start items-center gap-6 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* Лайки */}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm 
                        hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer">
                        <i className="far fa-heart"></i>
                        <span>{likes}</span>
                    </div>

                    {/* Комментарии */}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm 
                        hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">
                        <i className="far fa-comment"></i>
                        <span>{comments}</span>
                    </div>

                    {/* Закладки */}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm 
                        hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors cursor-pointer">
                        <i className="far fa-bookmark"></i>
                        <span>{saved}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
