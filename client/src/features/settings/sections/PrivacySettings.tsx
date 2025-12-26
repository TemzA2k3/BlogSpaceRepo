import { type FC } from "react";
import { useTranslation } from "react-i18next";

import {
    SectionHeader,
    SettingGroup,
    SettingRow,
    Toggle
} from "../components";

import type { SettingsProps } from "@/shared/types/settings.types";

export const PrivacySettings: FC<SettingsProps> = ({ settings, onUpdate }) => {
    const { t } = useTranslation();

    const handleTogglePublicProfile = () => {
        onUpdate("isPublicProfile", !settings.isPublicProfile);
    };

    return (
        <>
            <SectionHeader
                title={t("settings.privacy")}
                subtitle={t("settings.privacySubtitle")}
            />

            <SettingGroup title={t("settings.profileVisibility")}>
                <SettingRow
                    label={t("settings.publicProfile")}
                    description={t("settings.publicProfileHint")}
                >
                    <Toggle
                        enabled={settings.isPublicProfile ?? true}
                        onChange={handleTogglePublicProfile}
                    />
                </SettingRow>
            </SettingGroup>
        </>
    );
};