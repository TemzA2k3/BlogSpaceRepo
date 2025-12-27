import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FormContainer } from "@/shared/components/FormContainer";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import { sendPasswordResetEmail } from "@/shared/services/sendPasswordResetEmail";

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const { showAlert } = useAlert();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return showAlert(t("auth.enterEmail"), "error");

        try {
            setLoading(true);
            await sendPasswordResetEmail(email);
            showAlert(t("auth.resetEmailSent"), "success");
        } catch (err: any) {
            showAlert(err.message || t("auth.resetEmailError"), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer
            isShowLogo={true}
            title={t("forms.forgotPasswordTitle")}
            label={t("forms.forgotPasswordDescription")}
            isShowAuthLabel={false}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.enterEmail")}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? t("auth.sending") : t("auth.sendResetLink")}
                </button>
            </form>
        </FormContainer>
    );
};
