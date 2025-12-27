import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { deleteAccount, changePassword } from "@/store/slices/authSlice";

import {
    SectionHeader,
    SettingGroup,
    SettingRow,
    SelectButton,
    DeleteAccountModal,
    ChangePasswordModal
} from "../components";

export const AccountSettings: FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const handleDeleteAccount = async () => {
        setDeleting(true);

        try {
            const result = await dispatch(deleteAccount());

            if (deleteAccount.fulfilled.match(result)) {
                showAlert(t("settings.accountDeleted"), "success");
                navigate("/");
            } else {
                showAlert(result.payload as string || t("settings.deleteAccountError"), "error");
            }
        } catch (err: any) {
            showAlert(err.message || t("settings.deleteAccountError"), "error");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleChangePassword = async (currentPassword: string, newPassword: string) => {
        setChangingPassword(true);

        try {
            const result = await dispatch(changePassword({ currentPassword, newPassword }));

            if (changePassword.fulfilled.match(result)) {
                showAlert(t("settings.passwordChanged"), "success");
                setShowPasswordModal(false);
            } else {
                showAlert(result.payload as string || t("settings.changePasswordError"), "error");
            }
        } catch (err: any) {
            showAlert(err.message || t("settings.changePasswordError"), "error");
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <>
            <SectionHeader
                title={t("settings.account")}
                subtitle={t("settings.accountSubtitle")}
            />

            <SettingGroup title={t("settings.security")}>
                <SettingRow
                    label={t("settings.changePassword")}
                    description={t("settings.changePasswordHint")}
                >
                    <SelectButton
                        value={t("settings.change")}
                        onClick={() => setShowPasswordModal(true)}
                    />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title={t("settings.accountActions")}>
                <SettingRow
                    label={t("settings.deleteAccount")}
                    description={t("settings.deleteAccountHint")}
                >
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        {t("settings.delete")}
                    </button>
                </SettingRow>
            </SettingGroup>

            {showDeleteModal && (
                <DeleteAccountModal
                    loading={deleting}
                    onConfirm={handleDeleteAccount}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}

            {showPasswordModal && (
                <ChangePasswordModal
                    loading={changingPassword}
                    onSubmit={handleChangePassword}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </>
    );
};