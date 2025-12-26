import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";

import { useLanguage } from "@/hooks/language/useLanguage";

import { SectionHeader, SettingGroup, SettingRow, SelectButton, LanguageSelectModal } from "../components";

import type { SettingsProps } from "@/shared/types/settings.types"

const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    ru: "Русский",
};

export const LanguageSettings: FC<SettingsProps> = ({ settings, onUpdate }) => {
    const { t } = useTranslation();
    const { currentLanguage, changeLanguage } = useLanguage();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const handleLanguageSelect = async (lang: string) => {
        changeLanguage(lang as "en" | "ru");

        await onUpdate("displayLanguage", lang);
    };

    const displayLanguage = currentLanguage || settings.displayLanguage || "en";

    return (
        <>
            <SectionHeader
                title={t("settings.language")}
                subtitle={t("settings.languageSubtitle")}
            />

            <SettingGroup title={t("settings.appLanguage")}>
                <SettingRow
                    label={t("settings.displayLanguage")}
                    description={t("settings.displayLanguageHint")}
                >
                    <SelectButton
                        value={LANGUAGE_NAMES[displayLanguage] || displayLanguage}
                        onClick={() => setShowLanguageModal(true)}
                    />
                </SettingRow>
            </SettingGroup>

            {showLanguageModal && (
                <LanguageSelectModal
                    currentLanguage={displayLanguage}
                    onSelect={handleLanguageSelect}
                    onClose={() => setShowLanguageModal(false)}
                />
            )}
        </>
    );
};