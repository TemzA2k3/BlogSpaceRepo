import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { createArticle } from "@/store/slices/articleSlice";

import type { ArticleSections } from "@/shared/types/article.types";

type FocusableElement = HTMLInputElement | HTMLTextAreaElement;

export const useCreateArticle = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector((state) => state.auth);
    const { isLoading, error } = useAppSelector((state) => state.articles);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { showAlert } = useAlert();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sections, setSections] = useState<ArticleSections[]>([{ id: Date.now(), title: "", content: "" }]);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);

    const lastFocusedElement = useRef<FocusableElement | null>(null);
    const cursorPosition = useRef<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFieldFocus = (e: React.FocusEvent<FocusableElement>) => {
        lastFocusedElement.current = e.target;
        cursorPosition.current = e.target.selectionStart ?? e.target.value.length;
    };

    const handleSelectionChange = (e: React.SyntheticEvent<FocusableElement>) => {
        const target = e.currentTarget;
        cursorPosition.current = target.selectionStart ?? target.value.length;
        lastFocusedElement.current = target;
    };

    const addSection = () => setSections(prev => [...prev, { id: Date.now(), title: "", content: "" }]);
    const removeSection = (id: number) => setSections(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
    const updateSection = (id: number, field: "title" | "content", value: string) =>
        setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

    const handleImageClick = () => fileInputRef.current?.click();
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => e.target.files && setCoverImage(e.target.files[0]);
    const removeImage = () => setCoverImage(null);

    const toggleEmojiPicker = () => setShowEmojiPicker(prev => !prev);

    const addEmoji = (emoji: string) => {
        const element = lastFocusedElement.current;
        if (!element) return;

        const start = cursorPosition.current;
        const currentValue = element.value;
        const newValue = currentValue.slice(0, start) + emoji + currentValue.slice(start);

        const fieldType = element.dataset.fieldType;
        const sectionId = element.dataset.sectionId;
        const sectionField = element.dataset.field as "title" | "content" | undefined;

        if (fieldType === "title") {
            setTitle(newValue);
        } else if (fieldType === "description") {
            setDescription(newValue);
        } else if (sectionId && sectionField) {
            updateSection(Number(sectionId), sectionField, newValue);
        }

        const newCursorPos = start + emoji.length;
        cursorPosition.current = newCursorPos;

        setTimeout(() => {
            if (element) {
                element.focus();
                element.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);

        setShowEmojiPicker(false);
    };

    const handleTagClick = () => {
        const element = lastFocusedElement.current;
        if (!element) return;

        const sectionId = element.dataset.sectionId;
        const sectionField = element.dataset.field;

        if (!sectionId || sectionField !== "content") return;

        const section = sections.find(s => s.id === Number(sectionId));
        if (!section) return;

        const { selectionStart, selectionEnd } = element;
        if (selectionStart === null || selectionEnd === null || selectionStart === selectionEnd) return;

        const selectedText = section.content.slice(selectionStart, selectionEnd).trim();
        if (!selectedText) return;

        const emojiRegex = /[\p{Emoji_Presentation}\u200d]/u;
        if (emojiRegex.test(selectedText)) return;

        if (!tags.includes(selectedText)) {
            setTags(prev => [...prev, selectedText]);
        }

        updateSection(
            Number(sectionId),
            "content",
            section.content.slice(0, selectionStart) + section.content.slice(selectionEnd)
        );
    };

    const handleSubmit = async () => {
        if (!title.trim()) return setValidationError(t("articles.titleRequired"));
        if (!coverImage) return setValidationError(t("articles.coverRequired"));
        const hasContent = sections.some(s => s.title.trim() || s.content.trim());
        if (!hasContent) return setValidationError(t("articles.sectionRequired"));

        const formData = new FormData();
        formData.append("title", title);
        if (description.trim()) formData.append("description", description);
        formData.append("sections", JSON.stringify(sections));
        if (tags.length) formData.append("hashtags", JSON.stringify(tags));
        if (coverImage) formData.append("coverImage", coverImage);

        try {
            await dispatch(createArticle(formData)).unwrap();
            showAlert(t("articles.publishSuccess"), "success");
            navigate("/articles");
        } catch (err: any) {
            showAlert(err || t("articles.publishError"), "error");
        }
    };

    useEffect(() => {
        if (validationError) showAlert(validationError, "error");
        else if (error) showAlert(error, "error");
    }, [validationError, error]);

    return {
        currentUser,
        isLoading,
        title,
        setTitle,
        description,
        setDescription,
        sections,
        addSection,
        removeSection,
        updateSection,
        coverImage,
        handleImageClick,
        handleImageChange,
        removeImage,
        showEmojiPicker,
        toggleEmojiPicker,
        addEmoji,
        tags,
        handleTagClick,
        removeTag: (idx: number) => setTags(prev => prev.filter((_, i) => i !== idx)),
        handleFieldFocus,
        handleSelectionChange,
        fileInputRef,
        handleSubmit,
    };
};