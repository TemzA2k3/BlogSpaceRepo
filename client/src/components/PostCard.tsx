import { type FC } from "react";

import { getImageUrl } from "@/shared/utils/getImagesUrls"

import type { PostCardProps } from "@/shared/types/postTypes";

export const PostCard: FC<PostCardProps> = ({
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
    // Преобразуем дату в читаемый формат
    const formattedDate = new Date(date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="self-stretch px-5 py-4 bg-slate-50 dark:bg-darkbg border border-gray-200 dark:border-gray-700 rounded-2xl flex justify-start items-start gap-4 shadow-sm hover:shadow-md transition-all duration-200">
            
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
                        <div className="text-neutral-900 dark:text-gray-100 text-[17px] font-semibold leading-snug">
                            {firstName} {lastName}
                        </div>
                        <div className="text-slate-500 dark:text-gray-400 text-sm font-normal">
                            {username}
                        </div>
                    </div>

                    {/* Контент поста с сохранением переносов */}
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
