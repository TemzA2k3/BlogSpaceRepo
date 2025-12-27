import { useTranslation } from "react-i18next";

import { FormContainer } from "@/shared/components/FormContainer";
import { SignInForm } from "@/features/auth/SignInForm"

export const SignInPage = () => {
    const { t } = useTranslation();

  return (
    <FormContainer
        isShowLogo={true}
        title={ t("forms.signInToAccount") }
        label={ t("forms.signInToAccountDescription") } 
    >
        <SignInForm />
    </FormContainer>
  );
};
