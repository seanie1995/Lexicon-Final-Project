"use client";

{/* Changed this to a client component so we can handle form state and submission.
// The original was a server component (no interactivity needed at the time).
Now this being a client component, I had to create a separate layout.tsx file to hold the metadata
as Next.js doesnt allow metadata in client components. 
// The design is unchanged — just the form wired up to be functional.*/}

import { BookOpenText, Send, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  {/* Tracks what the user has typed */}
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  {/* UI states — loading while sending, success/error after */}
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    {/*Clear any previous error as soon as user starts typing again */}
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Success — show confirmation and reset the form
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Could not send your message. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface pt-24">
      <section className="mx-auto flex max-w-screen-2xl flex-col items-start gap-14 px-8 py-20 md:flex-row md:gap-16 lg:px-12">
        <div className="w-full space-y-10 md:w-5/12 md:space-y-12">
          <div className="space-y-4">
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
              Correspondence
            </p>
            <h1 className="max-w-sm font-headline text-5xl italic leading-[0.95] text-primary md:text-6xl lg:text-7xl">
              Contact the Curator
            </h1>
          </div>

          <p className="max-w-md text-lg leading-[1.9] text-on-surface-variant">
            For scholarly inquiries, acquisition proposals, or requests
            regarding our private collections, we invite you to send your
            correspondence. Each message is reviewed with the meticulous care
            that our heritage deserves.
          </p>

          <div className="max-w-md border-l-2 border-primary bg-surface-container-lowest px-6 py-6">
            <p className="text-base italic leading-[1.8] text-primary">
              &quot;The archive is not a quiet place of the past, but a living
              dialogue between generations. We look forward to your contribution
              to that discourse.&quot;
            </p>
            <p className="mt-4 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
              Elias Vance, Lead Curator
            </p>
          </div>

          <div className="grid gap-8 pt-2">
            <div className="space-y-2">
              <h2 className="font-headline text-lg font-bold text-on-surface">
                Archival Address
              </h2>
              <p className="leading-relaxed text-on-surface-variant">
                42 Old Library Mews,
                <br />
                Oxford, OX1 4BH,
                <br />
                United Kingdom
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-headline text-lg font-bold text-on-surface">
                Private Line
              </h2>
              <p className="text-on-surface-variant">+44 (0) 1865 270000</p>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-7/12">
          <div className="overflow-hidden bg-surface-container-low">
            {/* biome-ignore lint/performance/noImgElement: using the provided remote reference artwork to match the supplied design */}
            <img
              alt="Vintage inkwell"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDup3mgoT3qUKujDmrI5reBpBLolpbDXD07dwyiahXh5OZyQ21lYtDsS9m136Be4tv6u0f1IzTPy_955L7psTFNK5h75VoMJF8R5HPh3BS5uPtwTSIzm4hJAutm_kgD03ZGGHLUT-Xvi-OAMrvYqs8bfwxl4KaB3NY4vePozd_SJEj75H_2-HsT1aN7DKAjQE--eck15ScXBIVBo4pdLV-bClTcVE2yeKepryGmqwcJiptziGv6CIdoUnP5_Yg4olJc9xwjxBoMBqP1"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden h-48 w-48 bg-primary/5 lg:block" />
        </div>
      </section>

      <section className="bg-surface-container-low px-8 py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-4xl bg-surface-container-lowest p-10 shadow-sm md:p-16 lg:p-20">

          {/* Success message — shown after email sends successfully */}
          {success ? (
            <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
              <CheckCircle className="h-12 w-12 text-primary" aria-hidden="true" />
              <h2 className="font-headline text-3xl italic text-primary">
                Correspondence Received
              </h2>
              <p className="max-w-sm text-on-surface-variant leading-relaxed">
                Thank you for reaching out. We will review your message with
                the care it deserves and respond in due course.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
				aria-label="Send another message"
                className="mt-2 font-label text-xs uppercase tracking-[0.24em] text-secondary hover:text-primary transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-label="Contact form" className="space-y-12">

              {/* Error banner — now with accessibility attributes */}
              {error && (
                <div role="alert" aria-live="polite"className="p-4 bg-error-container text-on-error-container text-sm font-label">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="peer w-full border-x-0 border-b border-t-0 border-outline-variant bg-transparent py-4 text-lg text-on-surface placeholder-transparent transition-all focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                  <label
                    htmlFor="name"
                    className="pointer-events-none absolute left-0 -top-4 font-label text-xs uppercase tracking-[0.24em] text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:tracking-[0.12em] peer-placeholder-shown:text-secondary peer-focus:-top-4 peer-focus:text-xs peer-focus:tracking-[0.24em] peer-focus:text-primary"
                  >
                    Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Electronic Post"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="peer w-full border-x-0 border-b border-t-0 border-outline-variant bg-transparent py-4 text-lg text-on-surface placeholder-transparent transition-all focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute left-0 -top-4 font-label text-xs uppercase tracking-[0.24em] text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:tracking-[0.12em] peer-placeholder-shown:text-secondary peer-focus:-top-4 peer-focus:text-xs peer-focus:tracking-[0.24em] peer-focus:text-primary"
                  >
                    Electronic Post
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="peer w-full border-x-0 border-b border-t-0 border-outline-variant bg-transparent py-4 text-lg text-on-surface placeholder-transparent transition-all focus:border-primary focus:outline-none disabled:opacity-50"
                />
                <label
                  htmlFor="subject"
                  className="pointer-events-none absolute left-0 -top-4 font-label text-xs uppercase tracking-[0.24em] text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:tracking-[0.12em] peer-placeholder-shown:text-secondary peer-focus:-top-4 peer-focus:text-xs peer-focus:tracking-[0.24em] peer-focus:text-primary"
                >
                  Subject of Inquiry
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="peer w-full resize-none border-x-0 border-b border-t-0 border-outline-variant bg-transparent py-4 text-lg text-on-surface placeholder-transparent transition-all focus:border-primary focus:outline-none disabled:opacity-50"
                />
                <label
                  htmlFor="message"
                  className="pointer-events-none absolute left-0 -top-4 font-label text-xs uppercase tracking-[0.24em] text-on-surface-variant transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:tracking-[0.12em] peer-placeholder-shown:text-secondary peer-focus:-top-4 peer-focus:text-xs peer-focus:tracking-[0.24em] peer-focus:text-primary"
                >
                  Message
                </label>
              </div>

              <div className="flex justify-center pt-2 md:justify-start">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative inline-flex items-center gap-3 bg-primary px-12 py-5 font-label text-[11px] font-semibold uppercase tracking-[0.24em] text-on-primary transition-all hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Correspondence
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </>
                  )}
                  <span className="pointer-events-none absolute inset-0 -m-1.5 border border-primary opacity-30 transition-all group-hover:m-0" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-8 py-24 text-center lg:px-12">
        <h2 className="mb-6 font-headline text-4xl italic text-secondary">
          &quot;History is a conversation we must keep alive.&quot;
        </h2>
        <div className="flex justify-center gap-12">
          <div className="flex flex-col items-center">
            <BookOpenText className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">
              Est. 1924
            </span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="mb-2 h-5 w-5 text-primary" aria-hidden="true"/>
            <span className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">
              Verified Scholarly Source
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
