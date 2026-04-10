export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("sv-SE", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
};

export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(date));
};
