import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import { FormContainer } from "@/components/FormContainer";
import { sendNewPassword } from "@/shared/services/sendNewPassword";
import { Button } from "@/shared/components/Button";
import { initialResetPasswordValues, getResetPasswordSchema } from "@/shared/utils/authValidation";
import { useAlert } from "@/app/providers/alert/AlertProvider";

export const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    useEffect(() => {
        if (!token) {
            navigate("/", { replace: true });
        }
    }, [token, navigate]);

    const formik = useFormik({
        initialValues: initialResetPasswordValues,
        validationSchema: getResetPasswordSchema(t),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await sendNewPassword(token!, values.password);
                showAlert(t("forms.resetPasswordSuccess"), "success");
                navigate("/signin")
            } catch (err: any) {
                showAlert(err.message || t("forms.resetPasswordError"), "error");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <FormContainer
            title={t("forms.resetPasswordTitle")}
            label={t("forms.resetPasswordDescription")}
            isShowAuthLabel={false}
            isSignInForm={false}
        >
            <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("forms.newPassword")}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder={t("forms.newPassword")}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("forms.confirmPassword")}
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder={t("forms.confirmPassword")}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-300"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full py-2 mt-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors duration-300"
                >
                    {formik.isSubmitting ? <i className="fa fa-spinner fa-spin mr-2" /> : null}
                    {t("forms.sendResetLink")}
                </Button>
            </form>
        </FormContainer>
    );
};
