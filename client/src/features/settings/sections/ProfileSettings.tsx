import { useState, useRef, type FC } from "react";
import { useTranslation } from "react-i18next";

import { getAvatarUrl } from "@/shared/utils/getImagesUrls";
import { useAvatarUpdater } from "@/hooks/profile/useAvatarUpdater";

import { SectionHeader, SettingGroup, SettingRow, SelectButton } from "../components";

import { EditFieldModal } from "@/features/settings/modals/EditFieldModal"

import type { ProfileSettingsProps, EditableField } from "@/shared/types/settings.types";

export const ProfileSettings: FC<ProfileSettingsProps> = ({ settings, updating, onUpdate }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { handleAvatarChange, handleAvatarDelete, loading: avatarLoading } = useAvatarUpdater();

    const [editingField, setEditingField] = useState<EditableField>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleAvatarChange(file);
        }
        e.target.value = "";
    };

    const handleSaveField = async (field: EditableField, value: string) => {
        if (!field) return;

        const result = await onUpdate({ [field]: value });
        if (result) {
            setEditingField(null);
        }
    };

    const getFieldConfig = (field: EditableField) => {
        switch (field) {
            case "firstName":
                return {
                    title: t("settings.firstName"),
                    value: settings.firstName,
                    maxLength: 50,
                    multiline: false,
                    type: "text" as const,
                };
            case "lastName":
                return {
                    title: t("settings.lastName"),
                    value: settings.lastName,
                    maxLength: 50,
                    multiline: false,
                    type: "text" as const,
                };
            case "userName":
                return {
                    title: t("settings.username"),
                    value: settings.userName?.replace(/^@/, "") || "",
                    maxLength: 30,
                    multiline: false,
                    prefix: "@",
                    type: "username" as const,
                };
            case "bio":
                return {
                    title: t("settings.bio"),
                    value: settings.bio || "",
                    maxLength: 500,
                    multiline: true,
                    type: "text" as const,
                };
            case "location":
                return {
                    title: t("settings.location"),
                    value: settings.location || "",
                    maxLength: 100,
                    multiline: false,
                    type: "text" as const,
                };
            case "website":
                return {
                    title: t("settings.website"),
                    value: settings.website || "",
                    maxLength: 200,
                    multiline: false,
                    type: "url" as const,
                };
            default:
                return null;
        }
    };

    const fieldConfig = editingField ? getFieldConfig(editingField) : null;

    return (
        <>
            <SectionHeader
                title={t("settings.myProfile")}
                subtitle={t("settings.myProfileSubtitle")}
            />

            {/* Avatar Section */}
            <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={getAvatarUrl(
                                settings.firstName,
                                settings.lastName,
                                settings.avatar
                            )}
                            alt={t("settings.avatar")}
                            className={`w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 ${avatarLoading ? "opacity-50" : ""
                                }`}
                        />
                        {avatarLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <i className="fa-solid fa-spinner fa-spin text-blue-600 text-xl" />
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarLoading}
                            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 rounded-lg transition-colors"
                        >
                            {t("settings.changePhoto")}
                        </button>
                        {settings.avatar && (
                            <button
                                onClick={handleAvatarDelete}
                                disabled={avatarLoading}
                                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 rounded-lg transition-colors"
                            >
                                {t("settings.remove")}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <SettingGroup title={t("settings.personalInfo")}>
                <SettingRow label={t("settings.firstName")}>
                    <SelectButton
                        value={settings.firstName || t("settings.notSet")}
                        onClick={() => setEditingField("firstName")}
                    />
                </SettingRow>
                <SettingRow label={t("settings.lastName")}>
                    <SelectButton
                        value={settings.lastName || t("settings.notSet")}
                        onClick={() => setEditingField("lastName")}
                    />
                </SettingRow>
                <SettingRow label={t("settings.username")}>
                    <SelectButton
                        value={settings.userName || t("settings.notSet")}
                        onClick={() => setEditingField("userName")}
                    />
                </SettingRow>
                <SettingRow label={t("settings.bio")} description={t("settings.bioHint")}>
                    <SelectButton
                        value={settings.bio ? t("settings.edit") : t("settings.add")}
                        onClick={() => setEditingField("bio")}
                    />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title={t("settings.contact")}>
                <SettingRow label={t("settings.email")}>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {settings.email}
                    </span>
                </SettingRow>
                <SettingRow label={t("settings.location")}>
                    <SelectButton
                        value={settings.location || t("settings.notSet")}
                        onClick={() => setEditingField("location")}
                    />
                </SettingRow>
                <SettingRow label={t("settings.website")}>
                    <SelectButton
                        value={settings.website || t("settings.notSet")}
                        onClick={() => setEditingField("website")}
                    />
                </SettingRow>
            </SettingGroup>

            {/* Edit Modal */}
            {editingField && fieldConfig && (
                <EditFieldModal
                    title={fieldConfig.title}
                    initialValue={fieldConfig.value}
                    maxLength={fieldConfig.maxLength}
                    multiline={fieldConfig.multiline}
                    prefix={fieldConfig.prefix}
                    type={fieldConfig.type}
                    loading={updating}
                    onSave={(value) => handleSaveField(editingField, value)}
                    onClose={() => setEditingField(null)}
                />
            )}
        </>
    );
};
