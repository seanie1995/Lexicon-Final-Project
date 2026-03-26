export const formatPrice = (price: number) => {
	return new Intl.NumberFormat("sv-SE", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
};
