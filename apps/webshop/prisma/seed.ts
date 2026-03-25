import { PrismaClient } from "@prisma/client";
import { authors, categories, conditions, products, publishers } from "./bookSeedData";

const prisma = new PrismaClient();

async function main() {
	await prisma.product.deleteMany();
	await prisma.author.deleteMany();
	await prisma.publisher.deleteMany();
	await prisma.category.deleteMany();
	await prisma.condition.deleteMany();

	for (const category of categories) {
		await prisma.category.create({ data: category });
	}

	for (const condition of conditions) {
		await prisma.condition.create({ data: condition });
	}

	for (const author of authors) {
		await prisma.author.create({ data: author });
	}

	for (const publisher of publishers) {
		await prisma.publisher.create({ data: publisher });
	}

	const dbCategories = await prisma.category.findMany();
	const dbConditions = await prisma.condition.findMany();
	const dbAuthors = await prisma.author.findMany();
	const dbPublishers = await prisma.publisher.findMany();

	const categoryMap = new Map(dbCategories.map((c) => [c.name, c.id]));
	const conditionMap = new Map(dbConditions.map((c) => [c.grade, c.id]));
	const authorMap = new Map(dbAuthors.map((a) => [a.name, a.id]));
	const publisherMap = new Map(dbPublishers.map((p) => [p.name, p.id]));

	for (const product of products) {
		const {
			categoryName,
			conditionGrade,
			authorName,
			publisherName,
			...productData
		} = product;

		await prisma.product.create({
			data: {
				...productData,
				categoryId: categoryMap.get(categoryName)!,
				conditionId: conditionMap.get(conditionGrade)!,
				authorId: authorMap.get(authorName)!,
				publisherId: publisherMap.get(publisherName)!,
			},
		});
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