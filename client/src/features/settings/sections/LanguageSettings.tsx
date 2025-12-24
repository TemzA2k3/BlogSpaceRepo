import { useState, type FC } from "react";

import { useLanguage } from "@/hooks/language/useLanguage";

import { SectionHeader, SettingGroup, SettingRow, SelectButton, LanguageSelectModal } from "../components";

import type { User, UpdateSettingsPayload } from "@/shared/types/user.types";

interface LanguageSettingsProps {
    settings: User;
    updating: boolean;
    onUpdate: <K extends keyof UpdateSettingsPayload>(
        key: K,
        value: UpdateSettingsPayload[K]
    ) => Promise<{ success: boolean }>;
}

const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    ru: "Русский",
};

export const LanguageSettings: FC<LanguageSettingsProps> = ({ settings, onUpdate }) => {
    const { currentLanguage, changeLanguage } = useLanguage();
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const handleLanguageSelect = async (lang: string) => {
        changeLanguage(lang as "en" | "ru");
        
        await onUpdate("displayLanguage", lang);
    };

    const displayLanguage = currentLanguage || settings.displayLanguage || "en";

    return (
        <>
            <SectionHeader title="Language" subtitle="Choose your preferred language" />

            <SettingGroup title="App Language">
                <SettingRow label="Display Language" description="Language used throughout the app">
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
