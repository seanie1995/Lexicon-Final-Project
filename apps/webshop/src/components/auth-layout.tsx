import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  quoteText?: string;
  quoteAuthor?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  imageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuCM2SQIHyfsXzhrP3ZdGGqGlbS7B7Enz1yTvXBu9qdAMj-1m8CpxF4M7belMmHY5CXgQJrU702_BPpS--yFElKPQ7tvPFyKiRNhJCuriQvSxbL353bam2j6Ewf0SQkqOqPMFltupKL3-1trvu0gVH6jk0jVgfkY17XqWX2buo4xrkEwKZzMxL9IQTcq4jaDG-1S_HM_7rl9nWbswVJLRXqpnQ4MqQsorHKBhEWKwYkCarAO4YLg54PV2oZkvc5bM9mmTaCw-TF25dYh",
  imageAlt = "Rare Manuscript",
  quoteText = "A truly great book should be read in youth, again in maturity and once more in old age.",
  quoteAuthor = "Robertson Davies",
}) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-secondary-container">
      <main className="px-6 lg:px-20 py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center max-w-6xl mx-auto">
          {/* Left side: Hero Image with Overlay */}
          <div className="flex-1 relative">
            <div className="aspect-[4/5] w-full max-w-md mx-auto bg-surface-container-low p-8 border border-outline-variant/10 shadow-2xl relative">
              <img
                alt={imageAlt}
                className="w-full h-full object-cover grayscale-[20%] sepia-[10%]"
                src={imageSrc}
              />
              {/* Marginal Note Style Overlay */}
              <div className="absolute -bottom-10 -left-12 bg-surface-container-lowest p-6 max-w-xs shadow-xl hidden md:block">
                <div className="border-l-2 border-primary pl-4">
                  <p className="font-body italic text-on-surface leading-relaxed text-sm">
                    &ldquo;{quoteText}&rdquo;
                  </p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-secondary mt-3">
                    — {quoteAuthor}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Form */}
          <div className="flex-1 w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;