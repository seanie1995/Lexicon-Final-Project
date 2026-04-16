import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Handling | The Digital Archivist",
  description:
    "Review shipping, handling, packaging, and returns information for acquisitions from The Digital Archivist.",
};

const dispatchDetails = [
  {
    label: "EU & UK",
    value: "3-5 Business Days",
  },
  {
    label: "Americas",
    value: "5-7 Business Days",
  },
  {
    label: "Asia Pacific",
    value: "7-10 Business Days",
  },
];

const packagingDetails = [
  "Acid-free archival tissue wrap (pH 7.0)",
  "Custom-fitted Mylar dust jackets",
  "Double-walled climate buffer inserts",
];

const returnProtocol = [
  "Contact the Archivist to request a secure Return Authorization (RA).",
  "Utilize only our approved courier partner for the return transit.",
  "Package must be inspected by our conservator upon arrival before credit is issued.",
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-surface pt-24">
      <section className="mx-auto  px-6 py-16 md:px-12 md:py-24">
        <header className="mb-20 max-w-3xl text-center md:mb-24 md:text-left">
          <span className="mb-4 block font-label text-[11px] uppercase tracking-[0.3em] text-secondary">
            Institutional Protocol
          </span>
          <h1 className="mb-8 font-headline text-5xl font-light leading-[0.95] text-on-surface md:text-7xl">
            Shipping &amp; Handling
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-on-surface-variant italic">
            Our stewardship extends beyond the sale; it encompasses the safe
            transition of rare artifacts from our climate-controlled vaults to
            your private collection.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-12">
          <div className="md:col-span-4 md:sticky md:top-32">
            <div className="group relative mb-8 overflow-hidden bg-surface-container-low">
              {/* biome-ignore lint/performance/noImgElement: using the provided remote reference artwork to match the supplied design */}
              <img
                alt=""
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKwAAhg3Gm9fos9N7kTnTZMonf23Ik5iWxLU8nvoLtAixHIwu4jkGHtggr7HazKbJkcCVyGKvUXbz09peG3V9nd0jsuA-IoQnyA9qC6Y81B_BtE-u9H_scGbl0dlpnuVuYl_JtBc0rN8oItOB_W5MDMbf-VykxgdbT-ybisX1jqx2AkYzBbvOyTJk_XeP6WlNWqVfR9bkStwLZ99QlX7m7scIEU3cwprNbcJW7Fnsa1hw6S8jVZPd_QRv2_pwBRDociUDWP9WtfXsX"
                className="aspect-3/4 h-full w-full object-cover grayscale-[0.15]"
              />
              <div className="pointer-events-none absolute inset-0 bg-primary/8" />
            </div>

            <div className="border-l-2 border-primary bg-surface-container-lowest px-6 py-7 md:px-8">
              <blockquote>
                <p className="text-base leading-relaxed text-on-surface italic">
                  &quot;The preservation of a text is not merely in the reading,
                  but in the handling. We treat every dispatch as a transfer of
                  heritage.&quot;
                </p>
              </blockquote>

              <span className="mt-4 block font-label text-[12px] uppercase tracking-[0.22em] text-secondary">
                Lead Archivist
              </span>
            </div>
          </div>

          <div className="space-y-20 md:col-span-8 md:space-y-24">
            <section>
              <h2 className="mb-8 flex items-center gap-4 font-headline text-3xl text-on-surface">
                <span
                  aria-hidden="true"
                  className="font-light text-primary-container"
                >
                  01.
                </span>
                Scholarly Dispatch
              </h2>
              <div className="grid gap-8 text-base leading-relaxed text-on-surface-variant lg:grid-cols-2 lg:gap-12">
                <p>
                  Rare volumes require more than standard logistics. Every
                  acquisition is processed through our{" "}
                  <span className="text-primary italic">
                    White Glove Registry
                  </span>
                  . Items are shipped via specialized couriers who understand
                  the thermal and kinetic sensitivities of vellum and aged
                  paper.
                </p>
                <p>
                  Upon dispatch, the collector receives a digitized tracking
                  dossier. Standard transit times are secondary to safety; we
                  utilize optimized routes that minimize handling transfers and
                  environmental exposure.
                </p>
              </div>
            </section>
          <div className="space-y-20 md:col-span-8 md:space-y-24">
            <section>
              <h2 className="mb-8 flex items-center gap-4 font-headline text-3xl text-on-surface">
                <span className="font-light text-primary-container">01.</span>
                Scholarly Dispatch
              </h2>
              <div className="grid gap-8 text-base leading-relaxed text-on-surface-variant lg:grid-cols-2 lg:gap-12">
                <p>
                  Rare volumes require more than standard logistics. Every
                  acquisition is processed through our{" "}
                  <span className="text-primary italic">
                    White Glove Registry
                  </span>
                  . Items are shipped via specialized couriers who understand
                  the thermal and kinetic sensitivities of vellum and aged
                  paper.
                </p>
                <p>
                  Upon dispatch, the collector receives a digitized tracking
                  dossier. Standard transit times are secondary to safety; we
                  utilize optimized routes that minimize handling transfers and
                  environmental exposure.
                </p>
              </div>
            </section>

            <section className="bg-surface-container-low px-8 py-10 md:px-12 md:py-12">
              <h2 className="mb-8 flex items-center gap-4 font-headline text-3xl text-on-surface">
                <span
                  aria-hidden="true"
                  className="font-light text-primary-container"
                >
                  02.
                </span>
                Archival Packaging
              </h2>
              <div className="grid gap-10 text-on-surface sm:grid-cols-2 sm:gap-12">
                <div>
                  <h3 className="mb-4 font-label text-[11px] uppercase tracking-[0.22em] text-secondary">
                    Interior Protection
                  </h3>
                  <ul className="space-y-4 text-sm leading-relaxed">
                    {packagingDetails.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="text-lg leading-none text-primary"
                        >
                          •
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 font-label text-[11px] uppercase tracking-[0.22em] text-secondary">
                    Exterior Integrity
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    All out-bound parcels are disguised in non-descript,
                    heavy-duty neutral containers to ensure security. Each box
                    is sealed with tamper-evident archival tape.
                  </p>
                </div>
              </div>
            </section>
                <div>
                  <h3 className="mb-4 font-label text-[11px] uppercase tracking-[0.22em] text-secondary">
                    Exterior Integrity
                  </h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    All out-bound parcels are disguised in non-descript,
                    heavy-duty neutral containers to ensure security. Each box
                    is sealed with tamper-evident archival tape.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-8 flex items-center gap-4 font-headline text-3xl text-on-surface">
                <span
                  aria-hidden="true"
                  className="font-light text-primary-container"
                >
                  03.
                </span>
                International Provenance
              </h2>
              <div className="max-w-2xl text-on-surface-variant">
                <p className="mb-6 text-base leading-relaxed">
                  The Digital Archivist operates globally. We manage all customs
                  documentation, including CITES permits for items containing
                  restricted historical materials and Cultural Export Licences
                  where required by national law.
                </p>

                <div className="flex flex-wrap gap-x-10 gap-y-6 border-y border-outline-variant/20 py-6">
                  {dispatchDetails.map((detail) => (
                    <div key={detail.label}>
                      <span className="mb-1 block font-label text-[12px] uppercase tracking-[0.2em] text-secondary">
                        {detail.label}
                      </span>
                      <span className="text-on-surface italic">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-8 flex items-center gap-4 font-headline text-3xl text-on-surface">
                <span
                  aria-hidden="true"
                  className="font-light text-primary-container"
                >
                  04.
                </span>
                Curation Returns
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-on-surface-variant">
                <p>
                  Due to the sensitive nature of rare books, returns are
                  accepted strictly within{" "}
                  <span className="font-semibold text-primary">14 days</span> of
                  receipt. The item must remain in the original condition
                  recorded in our pre-dispatch high-resolution photographic
                  audit.
                </p>

                <div className="bg-surface-container-highest px-6 py-8 md:px-8">
                  <h3 className="mb-4 font-headline text-xl italic text-on-surface">
                    The Return Protocol:
                  </h3>
                  <ol className="space-y-4 text-sm leading-relaxed text-on-surface-variant list-decimal list-inside marker:font-bold marker:text-primary">
                    {returnProtocol.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
