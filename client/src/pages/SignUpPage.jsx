import { SignUp } from "@clerk/react";
import AuthLayout from "../components/Layout/AuthLayout";
const SignUpPage = () => {
    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join thousands of travelers securing their journeys"
        >
            <SignUp signInUrl="/sign-in" />
        </AuthLayout>
    );
};

export default SignUpPage;
