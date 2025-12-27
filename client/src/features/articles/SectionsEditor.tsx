import { type FC } from "react"
import { useTranslation } from "react-i18next";

import { EmojiPicker } from "@/shared/components/EmojiPicker"
import { HashTag } from "@/features/hashtags/HashTag"

import type { SectionsEditorProps } from "@/shared/types/article.types"

export const SectionsEditor: FC<SectionsEditorProps> = ({
    sections,
    lastFocusedTextarea,
    showEmojiPicker,
    addSection,
    removeSection,
    updateSection,
    toggleEmojiPicker,
    addEmoji,
    handleTagClick,
    tags,
    removeTag,
}) => {
    const { t } = useTranslation();

    return (
        <div className="px-6 py-6 flex flex-col gap-6">
            {sections.map(section => (
                <div
                    key={section.id}
                    className="
                        border border-gray-300 dark:border-gray-600
                        rounded-xl p-5 bg-gray-50 dark:bg-gray-700
                        shadow-sm
                        flex flex-col gap-4
                    "
                >
                    <input
                        type="text"
                        value={section.title}
                        onChange={e => updateSection(section.id, "title", e.target.value)}
                        placeholder={t("articles.sectionTitle")}
                        className="w-full text-xl font-semibold dark:text-gray-100 bg-transparent border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-0"
                    />

                    <textarea
                        value={section.content}
                        onChange={e => updateSection(section.id, "content", e.target.value)}
                        onFocus={e => (lastFocusedTextarea.current = e.target)}
                        data-section-id={section.id}
                        placeholder={t("articles.sectionContent")}
                        className="w-full bg-transparent dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-3 py-3 rounded-lg resize-none min-h-[120px] focus:outline-none focus:ring-0"
                    />

                    {sections.length > 1 && (
                        <button
                            onClick={() => removeSection(section.id)}
                            className="w-fit self-end px-3 py-1 rounded-lg font-medium transition text-red-500 dark:text-red-400 border border-red-400/40 dark:border-red-500/40 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                        >
                            {t("articles.deleteSection")}
                        </button>
                    )}
                </div>
            ))}

            <div className="flex items-center justify-between">
                <button
                    onClick={addSection}
                    className="px-5 py-2 rounded-xl font-medium transition text-white bg-blue-600 hover:bg-blue-700"
                >
                    + {t("articles.addSection")}
                </button>

                <div className="flex gap-3 text-gray-500 dark:text-gray-300">
                    <div className="relative">
                        <i
                            className="fa fa-smile text-lg cursor-pointer hover:text-yellow-400 transition"
                            onClick={toggleEmojiPicker}
                        ></i>
                        <EmojiPicker
                            show={showEmojiPicker}
                            onSelect={addEmoji}
                            onClose={() => { }}
                        />
                    </div>

                    <i
                        className="fa fa-tag text-lg cursor-pointer hover:text-green-400 transition"
                        onClick={handleTagClick}
                        title={t("articles.tagHint")}
                    ></i>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="px-0 pb-6 flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                        <HashTag key={idx} tag={tag} onRemove={() => removeTag(idx)} />
                    ))}
                </div>
            )}
        </div>
    )
}