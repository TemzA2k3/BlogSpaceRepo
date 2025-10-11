import { FormContainer } from "../components/FormContainer";
import { SignInForm } from "../components/SignInForm"

export const SignInPage = () => {
  return (
    <FormContainer
        isShowLogo={true}
        title={"Sign in to your account"}
        label={"Enter your email and password to access your account"} 
    >
        <SignInForm />
    </FormContainer>
  );
};
