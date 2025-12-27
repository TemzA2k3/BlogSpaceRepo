import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";
import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

import { EmojiPicker } from "@/shared/components/EmojiPicker";

import { HashTag } from "@/features/hashtags/HashTag"

import { createPost } from "@/store/slices/postSlice"
import { isValidPost } from "@/shared/utils/postValidation"

export const CreatePostPage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector(state => state.auth);
    const { loading, error } = useAppSelector(state => state.posts)
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const dispatch = useAppDispatch();

    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!isValidPost(content, image, hashtags)) {
            setValidationError(t("posts.createPostValidation"));
            return;
        }

        const formData = new FormData();

        if (content.trim()) formData.append("content", content);

        if (hashtags.length > 0) formData.append("hashtags", JSON.stringify(hashtags));

        if (image) formData.append("image", image);

        try {
            await dispatch(createPost(formData)).unwrap();

            showAlert(t("posts.createPostSuccess"), "success");

            navigate('/posts')
        } catch (err: any) {
            showAlert(err.message || t("posts.createPostError"), "error");
        }
    };

    const handleImageClick = () => fileInputRef.current?.click();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
    };

    const removeImage = () => setImage(null);

    const toggleEmojiPicker = () => setShowEmojiPicker(prev => !prev);

    const addEmoji = (emoji: string) => setContent(prev => prev + emoji);

    const handleHashtagClick = () => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;

        if (selectionStart === selectionEnd) return;

        const selectedText = content.slice(selectionStart, selectionEnd).trim();
        if (!selectedText) return;

        const emojiRegex = /[\p{Emoji_Presentation}\u200d]/u;
        if (emojiRegex.test(selectedText)) return;

        setHashtags(prev => [...prev, selectedText]);

        const newContent =
            content.slice(0, selectionStart) +
            content.slice(selectionEnd);
        setContent(newContent);
    };

    useEffect(() => {
        if (validationError) {
            showAlert(validationError, "error");
        } else if (error) {
            showAlert(error, "error");
        }
    }, [validationError, error]);


    return (
        <div className="max-w-[50rem] mx-auto mt-8 px-2">
            <div className="relative rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 min-h-[12rem]">
                <div className="absolute top-6 left-6">
                    {currentUser && (
                        <img
                            src={getAvatarUrl(currentUser.firstName, currentUser.lastName, currentUser.avatar)}
                            alt={currentUser.userName}
                            className="h-12 w-12 rounded-full object-cover"
                        />
                    )}
                </div>

                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("posts.createPostPlaceholder")}
                    className="w-full pl-20 pr-16 resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                    rows={6}
                />

                {image && (
                    <div className="mt-4 pl-20 relative inline-block">
                        <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-600">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                />

                <div className="absolute bottom-4 right-6 flex gap-2 text-gray-500 dark:text-gray-400">
                    <i
                        className="fa fa-image text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={handleImageClick}
                    ></i>
                    <div className="relative">
                        <i
                            className="fa fa-smile text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                            onClick={toggleEmojiPicker}
                        ></i>

                        <EmojiPicker
                            show={showEmojiPicker}
                            onSelect={addEmoji}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    </div>
                    <i
                        className="fa fa-hashtag text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={handleHashtagClick}
                    ></i>
                </div>

                {hashtags.length > 0 && (
                    <div className="mt-4 pl-20 flex flex-wrap gap-2">
                        {hashtags.map((tag, idx) => (
                            <HashTag
                                key={idx}
                                tag={tag}
                                onRemove={() => setHashtags((prev) => prev.filter((_, i) => i !== idx))}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && !image && hashtags.length === 0)}
                    className="rounded-full bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200"
                >
                    {loading && <i className="fa fa-spinner fa-spin" />}
                    {loading ? t("posts.publishing") : t("posts.publish")}
                </button>
            </div>
        </div>
    );
};