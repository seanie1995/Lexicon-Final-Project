import type { Metadata } from "next";
import AuthLayout from "@/components/auth-layout";
import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
	title: "Register | The Digital Archivist",
	description: "Create an account with The Digital Archivist to access exclusive content and resources.",
};

const RegisterPage = () => {
  return (
    <AuthLayout
      imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDmgKhZYM4QeuAtMbapUR0O4-gxRWIRHpgB-swGefXTqlwWG8ZrCqvqqrzs_jBslMRSv5gNV-_TovH8SBUJTujMEQPvIXsaZ1_mHJOTvXK_UtHbUpCAJSg6DVQKRCyHiRRVuEggpPWsvb1KmS7-50ngPJ1PSF_i8EHzAfj9JAMb0ecb-2eFUSmimhZ6SK3-mf0gTi1t9XxR0ZhoF1_AhYf7GAz1hJ48UfSSjMZwr3QLMrPkGqKnfttkduyrFcDTXbsie7Ap2U-eq-Jp"
      imageAlt="Botanical Manuscript"
      quoteText="The archive is not a graveyard of books, but a sanctuary of human thought."
      quoteAuthor="The Digital Archivist"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
