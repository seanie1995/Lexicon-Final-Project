interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	discountPercentage: number;
	weight: number;
	warrantyInformation: string;
	shippingInformation: string;
	availabilityStatus: string;
	category: Category;
	images: string[];
	thumbnail: string;
	tags: string[];
	condition: Condition;
	era: string;
	genre: string;
	author: Author;
	format: string;
	publisher: Publisher;
	year: Date;
	binding: string;
}

interface Category {
	id: number;
	name?: string;
}

interface Condition {
	id: number;
	exterior: string;
	interior: string;
	grade: string;
}

interface Author {
	id: number;
	name: string;
	description: string;
}

interface Publisher {
	id: number;
	name: string;
	description: string;
}
