import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { blogposts } from "./blogSeedData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.blogpost.deleteMany();

	for (const blogpost of blogposts) {
		await prisma.blogpost.create({ data: { ...blogpost } });
	}

	console.log("Blog seed data created successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
