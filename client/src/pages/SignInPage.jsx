import { SignIn } from "@clerk/react";
import AuthLayout from "../components/Layout/AuthLayout";
const SignInPage = () => {
    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your details to access your secure dashboard"
        >
            <SignIn signUpUrl="/sign-up" />
        </AuthLayout>
    );
};

export default SignInPage;
