export interface Product {
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
	images: any;
	thumbnail: string;
	tags: any;
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
	name: string;
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

export enum OrderStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	SHIPPED = "SHIPPED",
	DELIVERED = "DELIVERED",
	CANCELLED = "CANCELLED",
}

export interface Order {
	id: string;
	stripeSessionId: string;
	customerEmail: string;
	customerName?: string;
	totalAmount: number;
	currency: string;
	status: OrderStatus;

	shippingName: string;
	shippingLine1: string;
	shippingLine2?: string;
	shippingCity: string;
	shippingState?: string;
	shippingPostal: string;
	shippingCountry: string;

	createdAt: Date;
	updatedAt: Date;
	paidAt?: Date;
	shippedAt?: Date;
	deliveredAt?: Date;

	userId?: string;

	items: OrderItem[];
}

export interface OrderItem {
	id: string;
	productId?: number;
	title: string;
	unitPrice: number;
	totalPrice: number;
	orderId: string;
}

export type OrderWithItems = Order & { items: OrderItem[] };
