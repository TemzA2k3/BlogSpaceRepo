import { useTranslation } from "react-i18next";

import type { Language } from "@/shared/types/lang.types";

export function useLanguage() {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language.split("-")[0] as Language;

    const changeLanguage = (lng: "ru" | "en") => {
        i18n.changeLanguage(lng);
    };

    return { currentLanguage, changeLanguage };
}

