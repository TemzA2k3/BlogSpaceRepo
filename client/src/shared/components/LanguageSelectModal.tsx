import { useEffect, type FC } from "react";

interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

interface LanguageSelectModalProps {
    currentLanguage: string;
    onSelect: (lang: string) => void;
    onClose: () => void;
}

const LANGUAGES: LanguageOption[] = [
    { code: "en", name: "English", flag: "https://flagcdn.com/us.svg" },
    { code: "ru", name: "Русский", flag: "https://flagcdn.com/ru.svg" },
];

export const LanguageSelectModal: FC<LanguageSelectModalProps> = ({
    currentLanguage,
    onSelect,
    onClose,
}) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSelect = (code: string) => {
        if (code !== currentLanguage) {
            onSelect(code);
        }
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Select Language
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Language Options */}
                <div className="py-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full flex items-center gap-4 px-6 py-3 transition-colors ${
                                currentLanguage === lang.code
                                    ? "bg-blue-50 dark:bg-blue-900/20"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.name}
                                className="h-5 w-7 object-cover rounded-sm shadow-sm"
                            />
                            <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-200">
                                {lang.name}
                            </span>
                            {currentLanguage === lang.code && (
                                <i className="fa-solid fa-check text-blue-600 dark:text-blue-400" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
