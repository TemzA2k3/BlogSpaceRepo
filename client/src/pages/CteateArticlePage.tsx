import { useTranslation } from "react-i18next";

import { useCreateArticle } from "@/hooks/articles/useCreateArticle";

import { SectionsEditor } from "@/features/articles/SectionsEditor";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";

export const CreateArticlePage = () => {
    const { t } = useTranslation();
    const {
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
        removeTag,
        handleFieldFocus,
        handleSelectionChange,
        fileInputRef,
        handleSubmit,
    } = useCreateArticle();

    return (
        <div className="max-w-[56rem] mx-auto mt-8 px-2 pb-8">
            {currentUser && (
                <div className="mb-6 flex items-center gap-4">
                    <img
                        src={getAvatarUrl(currentUser.firstName, currentUser.lastName, currentUser.avatar) || "/placeholder.svg"}
                        alt={currentUser.userName}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold dark:text-gray-100">{t("articles.newArticle")}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t("articles.shareKnowledge")}</p>
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="relative bg-gray-100 dark:bg-gray-700 min-h-[16rem] flex items-center justify-center border-b border-gray-300 dark:border-gray-600">
                    {coverImage ? (
                        <div className="relative w-full h-64">
                            <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover" />
                            <button onClick={removeImage} className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8">×</button>
                        </div>
                    ) : (
                        <button onClick={handleImageClick} className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
                            <i className="fa fa-image text-4xl"></i>
                            <span>{t("articles.addCover")}</span>
                        </button>
                    )}
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                </div>

                <div className="p-6 border-b border-gray-300 dark:border-gray-700">
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onFocus={handleFieldFocus}
                        onSelect={handleSelectionChange}
                        onClick={handleSelectionChange}
                        onKeyUp={handleSelectionChange}
                        data-field-type="title"
                        placeholder={t("articles.articleTitle")}
                        className="w-full text-3xl font-bold bg-transparent border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-0 dark:text-gray-100"
                    />
                </div>
                <div className="px-6 pt-4 pb-2 border-b border-gray-300 dark:border-gray-700">
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        onFocus={handleFieldFocus}
                        onSelect={handleSelectionChange}
                        onClick={handleSelectionChange}
                        onKeyUp={handleSelectionChange}
                        data-field-type="description"
                        placeholder={t("articles.descriptionPlaceholder")}
                        rows={2}
                        className="w-full resize-none bg-transparent border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-0 dark:text-gray-200"
                    />
                </div>

                <SectionsEditor
                    sections={sections}
                    showEmojiPicker={showEmojiPicker}
                    addSection={addSection}
                    removeSection={removeSection}
                    updateSection={updateSection}
                    toggleEmojiPicker={toggleEmojiPicker}
                    addEmoji={addEmoji}
                    handleTagClick={handleTagClick}
                    tags={tags}
                    removeTag={removeTag}
                    handleFieldFocus={handleFieldFocus}
                    handleSelectionChange={handleSelectionChange}
                />

            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
                <button onClick={() => window.history.back()} className="w-full sm:w-auto rounded-full bg-gray-200 dark:bg-gray-700 px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    {t("articles.cancel")}
                </button>
                <button onClick={handleSubmit} disabled={isLoading || !title.trim()} className="w-full sm:w-auto rounded-full bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                    {isLoading && <i className="fa fa-spinner fa-spin" />}
                    {isLoading ? t("articles.publishing") : t("articles.publishArticle")}
                </button>
            </div>
        </div>
    );
};