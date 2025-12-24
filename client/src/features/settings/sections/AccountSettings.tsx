import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { deleteAccount } from "@/store/slices/authSlice";

import { SectionHeader, SettingGroup, SettingRow, SelectButton, DeleteAccountModal } from "../components";

export const AccountSettings: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setDeleting(true);

        try {
            const result = await dispatch(deleteAccount());

            if (deleteAccount.fulfilled.match(result)) {
                showAlert("Your account has been deleted", "success");
                navigate("/");
            } else {
                showAlert(result.payload as string || "Failed to delete account", "error");
            }
        } catch (err: any) {
            showAlert(err.message || "Failed to delete account", "error");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <SectionHeader title="Account" subtitle="Manage your account settings and security" />

            <SettingGroup title="Security">
                <SettingRow label="Change Password" description="Update your password regularly">
                    <SelectButton value="Change" />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title="Account Actions">
                <SettingRow label="Delete Account" description="Permanently delete your account and all data">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        Delete
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
        </>
    );
};
