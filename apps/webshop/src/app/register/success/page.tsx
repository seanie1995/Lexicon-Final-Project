import Link from "next/link";
import { Mail } from "lucide-react";

const RegisterSuccessPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface-container-lowest p-8 md:p-12 border border-outline-variant">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
              <Mail className="w-8 h-8 text-on-primary-container" />
            </div>
          </div>

          <h1 className="text-2xl font-serif text-primary text-center mb-4">
            Check Your Email
          </h1>

          <p className="text-on-surface-variant font-body text-center mb-6">
            A verification email has been sent to your email address. Please
            check your inbox and click the verification link to activate your
            account.
          </p>

          <div className="bg-surface-container-low p-4 border border-outline/20 mb-8">
            <p className="text-on-surface-variant font-body text-sm text-center">
              Didn&apos;t receive the email? Check your spam folder or contact
              support if the problem persists.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full py-3 bg-primary text-on-primary font-label uppercase tracking-wider text-sm text-center hover:bg-primary/90 transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RegisterSuccessPage;
