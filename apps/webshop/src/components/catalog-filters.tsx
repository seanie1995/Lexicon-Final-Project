"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterSection = {
  title: string;
  type: "checkbox" | "radio";
  options: string[];
};

const FilterOption = ({
  label,
  groupName,
  type,
  checked,
  onToggle,
}: {
  label: string;
  groupName: string;
  type: "checkbox" | "radio";
  checked: boolean;
  onToggle: () => void;
}) => {
  const sharedIndicatorClasses =
    "mr-3 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors";

  if (type === "radio") {
    return (
      <label
        className="group flex cursor-pointer items-center text-secondary transition-colors hover:text-primary"
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
      >
        <input
          className="peer sr-only"
          type="radio"
          name={groupName}
          checked={checked}
          readOnly
        />
        <span
          className={`${sharedIndicatorClasses} rounded-full border-outline-variant group-hover:border-primary peer-checked:border-primary`}
          aria-hidden="true"
        />
        <span>{label}</span>
      </label>
    );
  }

  return (
    <label
      className="group flex cursor-pointer items-center text-secondary transition-colors hover:text-primary"
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
    >
      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        readOnly
      />
      <span
        className={`${sharedIndicatorClasses} border-outline-variant group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </label>
  );
};

function buildUrl({
  pathname,
  currentParams,
  key,
  value,
  type,
  checked,
}: {
  pathname: string;
  currentParams: URLSearchParams;
  key: string;
  value: string;
  type: "checkbox" | "radio";
  checked: boolean;
}) {
  const next = new URLSearchParams(currentParams.toString());

  next.delete("page");

  if (type === "radio") {
    if (checked) next.set(key, value);
    else next.delete(key);
  } else {
    const existing = new Set(next.getAll(key));
    if (checked) existing.add(value);
    else existing.delete(value);

    next.delete(key);
    for (const v of existing) next.append(key, v);
  }

  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

const paramKeyForSection = (title: string) => {
  switch (title) {
    case "Genre":
      return "genre";
    case "Era":
      return "era";
    case "Condition":
      return "condition";
    default:
      return title.toLowerCase();
  }
};

const CatalogFilters = ({
  sections,
  selected,
}: {
  sections: FilterSection[];
  selected?: Record<string, string[]>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedFor = (sectionTitle: string) => selected?.[sectionTitle] ?? [];

  const hasActiveFilters =
    selected && Object.values(selected).some((v) => v.length > 0);

  return (
    <aside className="w-full lg:w-72 lg:flex-shrink-0">
      <div className="border border-outline-variant/30 bg-surface-container-low px-6 py-8 lg:sticky lg:top-32 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
        <div className="mb-10 flex items-end justify-between border-b border-outline-variant/20 pb-5 lg:hidden">
          <div>
            <p className="font-label text-label-sm uppercase text-outline">
              Browse
            </p>
            <h2 className="mt-2 font-headline text-2xl italic text-primary">
              Filters
            </h2>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              router.push(pathname);
              router.refresh();
            }}
            className="mb-8 w-full border border-outline-variant/40 py-3 font-label text-label-sm uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            Clear all filters
          </button>
        )}
        <div className="lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
          <div className="space-y-10 lg:space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="mb-6 font-label text-label-sm uppercase text-outline">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.options.map((option) => {
                    const currentChecked = selectedFor(section.title).includes(
                      option,
                    );
                    const key = paramKeyForSection(section.title);
                    return (
                      <li key={option}>
                        <FilterOption
                          label={option}
                          groupName={key}
                          type={section.type}
                          checked={currentChecked}
                          onToggle={() => {
                            const nextChecked = !currentChecked;
                            const href = buildUrl({
                              pathname,
                              currentParams: searchParams,
                              key,
                              value: option,
                              type: section.type,
                              checked: nextChecked,
                            });

                            router.push(href);
                            router.refresh();
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CatalogFilters;
