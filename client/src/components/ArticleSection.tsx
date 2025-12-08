import { type FC } from "react"

interface ArticleSectionProps {
    title?: string;
    content?: string;
}

export const ArticleSection: FC<ArticleSectionProps> = ({ title, content }) => {
    return (
        <>
            {title && (
                <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-gray-100">
                    {title}
                </h2>
            )}
            {content && (
                <p className="leading-relaxed mb-6">{content}</p>
            )}
        </>
    )
}