import type { Metadata } from "next";
import AuthLayout from "@/components/auth-layout";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign In | The Digital Archivist",
  description: "Sign in to your Digital Archivist account to access your orders and archive.",
};

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
