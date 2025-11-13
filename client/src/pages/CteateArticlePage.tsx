import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks"
import { useAlert } from "@/app/providers/alert/AlertProvider"
import { getAvatarUrl } from "@/shared/utils/getImagesUrls"

import { EmojiPicker } from "@/shared/components/EmojiPicker"
import { createArticle } from "@/store/slices/articleSlice"

export const CreateArticlePage = () => {
  const { currentUser } = useAppSelector((state) => state.auth)
  const { isLoading, error } = useAppSelector(state => state.articles)
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!title.trim()) {
      setValidationError("Заголовок обязателен")
      return
    }

    if (!content.trim() && !coverImage) {
      setValidationError("Нужно добавить текст статьи или обложку")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    if (description.trim()) formData.append("description", description)
    if (content.trim()) formData.append("content", content)
    if (tags.length > 0) formData.append("tags", JSON.stringify(tags))
    if (coverImage) formData.append("coverImage", coverImage)

    try {
      await dispatch(createArticle(formData)).unwrap()
      showAlert("Статья успешно опубликована!", "success")
      navigate("/articles")
    } catch (err: any) {
      showAlert(err || "Ошибка при публикации статьи", "error")
    }
  }

  const handleImageClick = () => fileInputRef.current?.click()
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCoverImage(e.target.files[0])
  }
  const removeImage = () => setCoverImage(null)
  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev)
  const addEmoji = (emoji: string) => setContent((prev) => prev + emoji)

  const handleTagClick = () => {
    if (!contentTextareaRef.current) return

    const textarea = contentTextareaRef.current
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd

    if (selectionStart === selectionEnd) return

    const selectedText = content.slice(selectionStart, selectionEnd).trim()
    if (!selectedText) return

    const emojiRegex = /[\p{Emoji_Presentation}\u200d]/u
    if (emojiRegex.test(selectedText)) return

    setTags((prev) => [...prev, selectedText])
    setContent(content.slice(0, selectionStart) + content.slice(selectionEnd))
  }

  useEffect(() => {
    if (validationError) {
      showAlert(validationError, "error")
    } else if (error) {
      showAlert(error, "error")
    }
  }, [validationError, error])

  return (
    <div className="max-w-[56rem] mx-auto mt-8 px-2 pb-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        {currentUser && (
          <img
            src={getAvatarUrl(currentUser.firstName, currentUser.lastName, currentUser.avatar) || "/placeholder.svg"}
            alt={currentUser.userName}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Новая статья</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Поделитесь своими знаниями и опытом</p>
        </div>
      </div>

      {/* Article composer */}
      <div className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        {/* Cover Image */}
        <div className="relative bg-gray-100 dark:bg-gray-700 min-h-[16rem] flex items-center justify-center border-b border-gray-300 dark:border-gray-600">
          {coverImage ? (
            <div className="relative w-full h-64">
              <img
                src={URL.createObjectURL(coverImage) || "/placeholder.svg"}
                alt="cover preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition shadow-lg"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={handleImageClick}
              className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <i className="fa fa-image text-4xl"></i>
              <span className="text-sm">Добавить обложку статьи</span>
            </button>
          )}
        </div>

        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />

        {/* Title */}
        <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок статьи"
            className="w-full text-3xl font-bold border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Description */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание (опционально)"
            className="w-full resize-none border-0 bg-transparent text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
            rows={2}
          />
        </div>

        {/* Content */}
        <div className="p-6 relative">
          <textarea
            ref={contentTextareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Расскажите свою историю..."
            className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 min-h-[20rem]"
            rows={12}
          />

          <div className="absolute bottom-6 right-6 flex gap-3 text-gray-500 dark:text-gray-400">
            <div className="relative">
              <i
                className="fa fa-smile text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition"
                onClick={toggleEmojiPicker}
              ></i>
              <EmojiPicker show={showEmojiPicker} onSelect={addEmoji} onClose={() => setShowEmojiPicker(false)} />
            </div>
            <i
              className="fa fa-tag text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition"
              onClick={handleTagClick}
              title="Выделите текст и нажмите для создания тега"
            ></i>
          </div>
        </div>

        {/* Tags display */}
        {tags.length > 0 && (
          <div className="px-6 pb-6 flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2 border border-blue-200 dark:border-blue-800"
              >
                <i className="fa fa-tag text-xs"></i>
                {tag}
                <button
                  onClick={() => setTags((prev) => prev.filter((_, i) => i !== idx))}
                  className="ml-1 text-blue-600 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400 text-sm transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate("/articles")}
          className="rounded-full bg-gray-200 dark:bg-gray-700 px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Отменить
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !title.trim()}
          className="rounded-full bg-blue-500 px-8 py-2 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
        >
          {isLoading && <i className="fa fa-spinner fa-spin" />}
          {isLoading ? "Публикуем..." : "Опубликовать статью"}
        </button>
      </div>
    </div>
  )
}
