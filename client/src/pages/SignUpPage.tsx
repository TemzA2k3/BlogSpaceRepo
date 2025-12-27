import { useTranslation } from "react-i18next";

import { FormContainer } from "@/shared/components/FormContainer";
import { SignUpForm } from "@/features/auth/SignUpForm"

export const SignUpPage = () => {
    const { t } = useTranslation();

  return (
    <FormContainer
        isShowLogo={true}
        title={ t("forms.signUpToAccount") }
        label={ t("forms.signUpToAccountDescription") }
        isSignInForm={false} 
    >
        
        <SignUpForm />

    </FormContainer>
  );
};
