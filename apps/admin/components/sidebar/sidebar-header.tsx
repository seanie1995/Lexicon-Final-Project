export default function SidebarHeader({ className }: { className?: string }) {
  return (
    <section className={`${className}`}>
      <h2>
        <span className="block font-bold text-3xl">Webbutiken</span>
        <span className="text-neutral-500 hidden md:block">Admin panel</span>
      </h2>
    </section>
  );
}
