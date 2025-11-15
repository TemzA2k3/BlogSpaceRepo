interface BlankDataProps {
    icon?: string;          // эмодзи-иконка (или можно заменить на Lucide позже)
    title: string;          // заголовок
    message?: string;       // описание
    className?: string;     // чтобы можно было менять отступы при необходимости
}

export const BlankData = ({
    icon = "📭",
    title,
    message,
    className = "",
}: BlankDataProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center py-14 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 ${className}`}
        >
            <div className="text-5xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>

            {message && (
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-xs">
                    {message}
                </p>
            )}
        </div>
    );
};
