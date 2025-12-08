interface BlankDataProps {
    icon?: string;
    title: string;
    message?: string;
    className?: string;

    // Опции
    bordered?: boolean;         // показывать рамку (default = true)
    background?: boolean;       // показывать фон (default = true)
    borderColor?: string;       // цвет рамки
    bgColor?: string;           // цвет фона
}

export const BlankData = ({
    icon = "📭",
    title,
    message,
    className = "",

    bordered = true,
    background = true,
    borderColor = "border-gray-300 dark:border-gray-700",
    bgColor = "bg-gray-50 dark:bg-gray-800/40",
}: BlankDataProps) => {
    return (
        <div
            className={`
                flex flex-col items-center justify-center
                text-center py-10 px-4 rounded-xl
                ${bordered ? `border ${borderColor}` : ""}
                ${background ? bgColor : ""}
                ${className}
            `}
        >
            <div className="text-5xl mb-3">{icon}</div>

            <h3 className="text-lg font-semibold mb-1">{title}</h3>

            {message && (
                <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                    {message}
                </p>
            )}
        </div>
    );
};
