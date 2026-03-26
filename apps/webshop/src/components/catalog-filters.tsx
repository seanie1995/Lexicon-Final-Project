type FilterSection = {
	title: string;
	type: "checkbox" | "radio";
	options: string[];
};

const FilterOption = ({
	label,
	groupName,
	type,
}: {
	label: string;
	groupName: string;
	type: "checkbox" | "radio";
}) => {
	const sharedIndicatorClasses =
		"mr-3 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors";

	if (type === "radio") {
		return (
			<label className="group flex cursor-pointer items-center text-secondary transition-colors hover:text-primary">
				<input className="sr-only" type="radio" name={groupName} readOnly />
				<span
					className={`${sharedIndicatorClasses} rounded-full border-outline-variant group-hover:border-primary`}
					aria-hidden="true"
				/>
				<span>{label}</span>
			</label>
		);
	}

	return (
		<label className="group flex cursor-pointer items-center text-secondary transition-colors hover:text-primary">
			<input className="sr-only" type="checkbox" readOnly />
			<span
				className={`${sharedIndicatorClasses} border-outline-variant group-hover:border-primary`}
				aria-hidden="true"
			/>
			<span>{label}</span>
		</label>
	);
};

const CatalogFilters = ({ sections }: { sections: FilterSection[] }) => {
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
				<div className="space-y-10 lg:space-y-12">
					{sections.map((section) => (
						<section key={section.title}>
							<h3 className="mb-6 font-label text-label-sm uppercase text-outline">
								{section.title}
							</h3>
							<ul className="space-y-3">
								{section.options.map((option) => (
									<li key={option}>
										<FilterOption
											label={option}
											groupName={section.title}
											type={section.type}
										/>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</div>
		</aside>
	);
};

export default CatalogFilters;
