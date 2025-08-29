import { useTranslation } from "react-i18next";


type Language = "ru" | "en";

export function useLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.split("-")[0] as Language;
  
  const changeLanguage = (lng: "ru" | "en") => {
    i18n.changeLanguage(lng);
  };

  return { currentLanguage, changeLanguage };
}

