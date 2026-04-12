import type { Metadata } from "next";

// Metadata lives here now since page.tsx is a client component.
// Next.js picks this up automatically for the /contact route.
export const metadata: Metadata = {
  title: "Contact | The Digital Archivist",
  description:
    "Get in touch with The Digital Archivist for acquisitions, research requests, and private collection inquiries.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}