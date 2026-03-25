import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// This is just a sample seed file to populate the database with initial data for testing and development purposes.
// You can modify the data as needed to fit your specific requirements.

async function main() {
	// Clean existing data
	await prisma.product.deleteMany();
	await prisma.author.deleteMany();
	await prisma.publisher.deleteMany();
	await prisma.category.deleteMany();
	await prisma.condition.deleteMany();

	// Create categories
	const categories = await Promise.all([
		prisma.category.create({ data: { name: "Fiction" } }),
		prisma.category.create({ data: { name: "Non-Fiction" } }),
		prisma.category.create({ data: { name: "Science Fiction" } }),
		prisma.category.create({ data: { name: "Fantasy" } }),
		prisma.category.create({ data: { name: "Mystery" } }),
		prisma.category.create({ data: { name: "Romance" } }),
	]);

	// Create conditions
	const conditions = await Promise.all([
		prisma.condition.create({
			data: { exterior: "Like New", interior: "Clean", grade: "A+" },
		}),
		prisma.condition.create({
			data: { exterior: "Good", interior: "Minimal wear", grade: "A" },
		}),
		prisma.condition.create({
			data: { exterior: "Fair", interior: "Some notes", grade: "B" },
		}),
		prisma.condition.create({
			data: { exterior: "Worn", interior: "Heavy use", grade: "C" },
		}),
	]);

	// Create authors
	const authors = await Promise.all([
		prisma.author.create({
			data: {
				name: "George Orwell",
				description:
					"English novelist and essayist, known for his sharp criticism of totalitarianism.",
			},
		}),
		prisma.author.create({
			data: {
				name: "Jane Austen",
				description:
					"English novelist known for her social commentary and wit.",
			},
		}),
		prisma.author.create({
			data: {
				name: "Isaac Asimov",
				description:
					"American writer and professor of biochemistry, prolific science fiction author.",
			},
		}),
		prisma.author.create({
			data: {
				name: "Agatha Christie",
				description:
					"English writer known for her detective novels and short story collections.",
			},
		}),
		prisma.author.create({
			data: {
				name: "J.R.R. Tolkien",
				description:
					"English writer, poet, and philologist, best known for The Lord of the Rings.",
			},
		}),
	]);

	// Create publishers
	const publishers = await Promise.all([
		prisma.publisher.create({
			data: {
				name: "Penguin Books",
				description: "British publishing house founded in 1935.",
			},
		}),
		prisma.publisher.create({
			data: {
				name: "HarperCollins",
				description: "One of the world's largest publishing companies.",
			},
		}),
		prisma.publisher.create({
			data: {
				name: "Vintage Books",
				description: "Imprint of Penguin Random House.",
			},
		}),
	]);

	// Create products
	const products = [
		{
			title: "1984",
			description:
				"A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
			price: 1299,
			discountPercentage: 10,
			weight: 300,
			warrantyInformation: "N/A",
			shippingInformation: "Ships in 2-3 business days",
			availabilityStatus: "In Stock",
			images: JSON.stringify([
				"https://example.com/1984-1.jpg",
				"https://example.com/1984-2.jpg",
			]),
			thumbnail: "https://example.com/1984-thumb.jpg",
			tags: JSON.stringify(["dystopian", "classic", "political"]),
			era: "20th Century",
			genre: "Dystopian Fiction",
			format: "Paperback",
			year: new Date("1949-06-08"),
			binding: "Softcover",
			categoryId: categories[0].id,
			conditionId: conditions[0].id,
			authorId: authors[0].id,
			publisherId: publishers[0].id,
		},
		{
			title: "Animal Farm",
			description:
				"An allegorical novella reflecting events leading up to the Russian Revolution.",
			price: 999,
			discountPercentage: 5,

			weight: 200,
			warrantyInformation: "N/A",
			shippingInformation: "Ships in 2-3 business days",
			availabilityStatus: "In Stock",
			images: JSON.stringify(["https://example.com/animal-farm-1.jpg"]),
			thumbnail: "https://example.com/animal-farm-thumb.jpg",
			tags: JSON.stringify(["allegory", "classic", "satire"]),
			era: "20th Century",
			genre: "Political Satire",
			format: "Paperback",
			year: new Date("1945-08-17"),
			binding: "Softcover",
			categoryId: categories[0].id,
			conditionId: conditions[1].id,
			authorId: authors[0].id,
			publisherId: publishers[0].id,
		},
		{
			title: "Pride and Prejudice",
			description:
				"A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.",
			price: 1199,
			discountPercentage: 15,
			weight: 350,
			warrantyInformation: "N/A",
			shippingInformation: "Ships in 2-3 business days",
			availabilityStatus: "In Stock",
			images: JSON.stringify(["https://example.com/pride-1.jpg"]),
			thumbnail: "https://example.com/pride-thumb.jpg",
			tags: JSON.stringify(["romance", "classic", "british"]),
			era: "19th Century",
			genre: "Romance",
			format: "Hardcover",
			year: new Date("1813-01-28"),
			binding: "Hardcover",
			categoryId: categories[5].id,
			conditionId: conditions[0].id,
			authorId: authors[1].id,
			publisherId: publishers[1].id,
		},
		{
			title: "Foundation",
			description:
				"The first novel in Isaac Asimov's famous Foundation series about the fall of a galactic empire.",
			price: 1499,
			discountPercentage: 0,
			weight: 400,
			warrantyInformation: "N/A",
			shippingInformation: "Ships in 2-3 business days",
			availabilityStatus: "In Stock",
			images: JSON.stringify(["https://example.com/foundation-1.jpg"]),
			thumbnail: "https://example.com/foundation-thumb.jpg",
			tags: JSON.stringify(["sci-fi", "space", "classic"]),
			era: "20th Century",
			genre: "Science Fiction",
			format: "Paperback",
			year: new Date("1951-06-01"),
			binding: "Softcover",
			categoryId: categories[2].id,
			conditionId: conditions[2].id,
			authorId: authors[2].id,
			publisherId: publishers[2].id,
		},
		{
			title: "Murder on the Orient Express",
			description:
				"A detective novel featuring the Belgian detective Hercule Poirot.",
			price: 1099,
			discountPercentage: 20,
			weight: 300,
			warrantyInformation: "N/A",
			shippingInformation: "Ships in 2-3 business days",
			availabilityStatus: "In Stock",
			images: JSON.stringify(["https://example.com/orient-1.jpg"]),
			thumbnail: "https://example.com/orient-thumb.jpg",
			tags: JSON.stringify(["mystery", "detective", "classic"]),
			era: "20th Century",
			genre: "Mystery",
			format: "Paperback",
			year: new Date("1934-01-01"),
			binding: "Softcover",
			categoryId: categories[4].id,
			conditionId: conditions[1].id,
			authorId: authors[3].id,
			publisherId: publishers[0].id,
		},
		{
			title: "The Hobbit",
			description:
				"A fantasy novel about the adventures of hobbit Bilbo Baggins.",
			price: 1699,
			discountPercentage: 10,
			weight: 500,
			warrantyInformation: "N/A",
			shippingInformation: "Ships in 2-3 business days",
			availabilityStatus: "In Stock",
			images: JSON.stringify([
				"https://example.com/hobbit-1.jpg",
				"https://example.com/hobbit-2.jpg",
			]),
			thumbnail: "https://example.com/hobbit-thumb.jpg",
			tags: JSON.stringify(["fantasy", "adventure", "classic"]),
			era: "20th Century",
			genre: "Fantasy",
			format: "Hardcover",
			year: new Date("1937-09-21"),
			binding: "Hardcover",
			categoryId: categories[3].id,
			conditionId: conditions[0].id,
			authorId: authors[4].id,
			publisherId: publishers[1].id,
		},
	];

	for (const product of products) {
		await prisma.product.create({ data: product });
	}

	console.log("Seed data created successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
