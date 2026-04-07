import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HomeEditorialSections = () => {
    return (
        <section className="bg-surface px-6 py-24 lg:px-20">
            <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {/* ── Large editorial block ── */}
                <article className="group relative col-span-1 overflow-hidden lg:col-span-2">
                    <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQx2RPr_BgFWj4GVC5cxcgZcewE9fii9vNvwR5rzRLL416PRxbodg6Tz5CxugzyHAQrQ-n2wJJkavIc6a-dOBVnvkpdr3UqqSItTnWs5TNZxaMbc6f3xtov6LC0tt-DSf0qCHP57_LyNgjuV7qbg-uThr7doDK61i20HF1Pw2PB_zMFQ8hQKYaGVTVebyVecrFWVyH0vNuqpUVuh119i_jsgVtA9Q89SEPuXb_l8_2Uz5BUWAIrgAX7nohR-EM4QQ9BssbADJFIO-z"
                            alt="Historic mahogany library with floor-to-ceiling bookshelves and rolling wooden ladder"
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                        />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/80 to-transparent p-12">
                        <p className="mb-2 font-label text-xs uppercase tracking-[0.3em] text-on-primary/70">
                            Curated Category
                        </p>
                        <h3 className="mb-6 font-headline text-4xl font-bold text-on-primary">
                            Classic Literature
                        </h3>
                        <Link
                            href="/catalog"
                            className="flex items-center gap-2 font-label text-xs uppercase tracking-widest text-on-primary transition-all group-hover:gap-4"
                        >
                            Browse the Collection
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </article>

                {/* ── Vertical block ── */}
                <article className="flex flex-col justify-between border border-outline-variant/10 bg-surface-container-high p-12">
                    <div className="space-y-6">
                        <h3 className="font-headline text-3xl font-bold text-on-surface">
                            Leather-bound Volumes
                        </h3>
                        <p className="leading-relaxed text-on-surface-variant">
                            Discover the tactile luxury of hand-stitched leather bindings from
                            the golden age of publishing.
                        </p>
                    </div>
                    <div className="pt-12">
                        <div className="relative mb-8 aspect-square overflow-hidden bg-surface-container-lowest">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7LmOBJvOIR-jKYo0FP2MwFH4VyoNhPdpQOrsNGotXMRkPqfrf3VpHWpDWobHcysRQeORNsgCAUyBvG0lSj_AP2ipJZZJZBZ28XWPf1R5RmXF-h7TqkXsjPU1DVacFxVvodyFEEuJT8B-BJrduL01iYWSfJr4_CRs-FEvAb6F5LQxBbRVSzsza5t4CRImc2BrPHf_W3znYxC6zBvCANNhzkPtuyJ2ItNpAOSoIstusXOWTzf49tpAOHTVEk1t25S_UIq-kwiLXwbHz"
                                alt="Aged book spines in various shades of brown and tan leather"
                                fill
                                className="object-cover grayscale-30"
                                sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                        </div>
                        <Link
                            href="/catalog"
                            className="font-label text-xs uppercase tracking-widest text-primary border-b border-primary pb-1"
                        >
                            Shop Leather-bound
                        </Link>
                    </div>
                </article>

                {/* ── Margin note callout ── */}
                <aside className="z-10 flex flex-col justify-center border border-outline-variant/10 bg-surface-container-lowest p-12 shadow-xl lg:mt-[-4rem]">
                    <blockquote className="space-y-6 border-l-4 border-primary pl-8">
                        <h4 className="font-headline text-2xl italic">
                            &ldquo;The archive is not a graveyard of books, but a sanctuary of
                            human thought.&rdquo;
                        </h4>
                        <p className="text-sm leading-loose text-on-surface-variant">
                            Our team of preservationists meticulously digitizes and catalogs
                            every volume to ensure that even the rarest editions are accessible
                            to scholars and bibliophiles alike. We believe that physical
                            history deserves a digital legacy.
                        </p>
                        <button
                            type="button"
                            className="font-label text-[10px] uppercase tracking-widest text-secondary transition-colors hover:text-primary"
                        >
                            Our Preservation Process
                        </button>
                    </blockquote>
                </aside>

                {/* ── More categories ── */}

                {/* TODO: When we have blogposts, we should use these to link to the blogposts */}
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:col-span-2">
                    <article className="group cursor-pointer">
                        <div className="relative mb-6 aspect-video overflow-hidden bg-surface-container-high">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg5wx04jwrwuBloxURW5fJD8qwpjHchxIjFbWpO_R9CEclQsZ9fZrs4QtaPhG6L0vA4mI_w2QgM5ItLsKbYtyH7e-DcIxf9xUWID_CCJE-MtAiKku0OZ9RVg7Z7TXbAlIVDPAoikTh99H2oc0vwlgZYNf_jldyB3-gDiHDQbL29LjKIpll7xKrOshSrufmEoxDIVWkeI7sT8lhLJDHopBJzy3H-gItobDvFO5r2LiudkDouvHiBnj6rpkFHFFD_IKwBRbf8QXlI_dL"
                                alt="Vintage fountain pen resting on an open journal with flowing script"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">
                            Poetry &amp; Verse
                        </h3>
                        <p className="mt-2 text-sm text-on-surface-variant">
                            Signed first editions of 19th-century masters.
                        </p>
                    </article>

                    <article className="group cursor-pointer">
                        <div className="relative mb-6 aspect-video overflow-hidden bg-surface-container-high">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCaL1idVZjinxFaGJDkpBsFOr9r2wf2dS3NbUhga0EmEErjdaw_bmcrd2bSENi_bixficd8pQEsXUCztkLM3Z5sZdtIlONiwVsjMxy2PrQ5hKt2e1OtVuByLpMtvG5sl7KPeSbPCPliI5JJ71W1HmqmsBf6u8nze05fu8KbLjLSUUTA8NCPSNv9biabfiG3-FQTqOhvHU9om8TbDFcH0q8JB_kdm0M8QOI0rA1aoIvwTVHDNF4w8U_-DPsY35vT-h5pBFZu6TCelYL"
                                alt="Atmospheric library with rows of books receding into shadows"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">
                            Historical Records
                        </h3>
                        <p className="mt-2 text-sm text-on-surface-variant">
                            Original cartography and census documents.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default HomeEditorialSections;