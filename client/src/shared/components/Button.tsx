import type { FC } from "react";

import type { ButtonProps } from "../types/button.types";

export const Button: FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    disabled = false,
    type = "button",
}) => {
    const baseClasses =
        "px-6 h-10 rounded-xl font-semibold flex cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

    let variantClasses = "";
    switch (variant) {
        case "primary":
            variantClasses = "bg-gray-900 text-white";
            break;
        case "secondary":
            variantClasses = "bg-white text-gray-700 border-2 border-gray-200";
            break;
        case "outline":
            variantClasses = "bg-transparent text-gray-700 border-2 border-gray-700";
            break;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};
