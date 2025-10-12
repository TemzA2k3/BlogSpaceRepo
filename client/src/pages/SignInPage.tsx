import { useTranslation } from "react-i18next";

import { FormContainer } from "../components/FormContainer";
import { SignInForm } from "../components/SignInForm"

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
