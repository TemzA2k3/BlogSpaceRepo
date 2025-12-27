import { useTranslation } from "react-i18next";

import type { SearchInputProps } from "@/shared/types/search-input.types"

export const SearchInput = ({
    value,
    onChange,
    placeholder,
    disabled = false,
    className = "",
}: SearchInputProps) => {
    const { t } = useTranslation();

    return (
        <div className="relative flex-1">
            <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || t("explore.searchUsers")}
                disabled={disabled}
                className={`pl-10 w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            />
        </div>
    );
};