import { type FC } from "react";

import { 
    SectionHeader, 
    SettingGroup, 
    SettingRow, 
    // SelectButton, 
    Toggle 
} from "../components";

import type { User, UpdateSettingsPayload } from "@/shared/types/user.types";

interface PrivacySettingsProps {
    settings: User;
    updating: boolean;
    onUpdate: <K extends keyof UpdateSettingsPayload>(
        key: K,
        value: UpdateSettingsPayload[K]
    ) => Promise<{ success: boolean }>;
}

// const WHO_CAN_MESSAGE_LABELS: Record<NonNullable<User["whoCanMessage"]>, string> = {
//     everyone: "Everyone",
//     followers: "Followers only",
//     nobody: "Nobody",
// };

export const PrivacySettings: FC<PrivacySettingsProps> = ({ settings, onUpdate }) => {
    const handleTogglePublicProfile = () => {
        onUpdate("isPublicProfile", !settings.isPublicProfile);
    };

    return (
        <>
            <SectionHeader title="Privacy & Security" subtitle="Control your privacy settings" />

            <SettingGroup title="Profile Visibility">
                <SettingRow label="Public Profile" description="Allow anyone to see your profile">
                    <Toggle
                        enabled={settings.isPublicProfile ?? true}
                        onChange={handleTogglePublicProfile}
                        // disabled={updating}
                    />
                </SettingRow>
            </SettingGroup>

            {/* <SettingGroup title="Interactions">
                <SettingRow label="Who can message me">
                    <SelectButton 
                        value={WHO_CAN_MESSAGE_LABELS[settings.whoCanMessage ?? "everyone"]} 
                    />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title="Blocked Users">
                <SettingRow label="Blocked Users" description="Manage your block list">
                    <SelectButton value="0 users" />
                </SettingRow>
            </SettingGroup> */}
        </>
    );
};
