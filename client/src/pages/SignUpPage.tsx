import { FormContainer } from "../components/FormContainer";
import { SignUpForm } from "../components/SignUpForm"

export const SignUpPage = () => {

  return (
    <FormContainer
        isShowLogo={true}
        title={"Create your account"}
        label={"Sign up to start reading, posting, and connecting with others"}
        isSignInForm={false} 
    >
        
        <SignUpForm />

    </FormContainer>
  );
};
