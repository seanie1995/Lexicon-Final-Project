import { prisma } from "../src";

async function main() {
	const args = process.argv.slice(2);
	const userId = args.find((arg) => arg.startsWith("--user="))?.split("=")[1];
	const email = args.find((arg) => arg.startsWith("--email="))?.split("=")[1];

	if (!userId && !email) {
		console.log("Usage:");
		console.log("  npx tsx seed-admin.ts --user=<supabase_user_id>");
		console.log("  npx tsx seed-admin.ts --email=<user_email>");
		console.log("");
		console.log("Options:");
		console.log("  --user=<id>    Supabase auth user ID");
		console.log("  --email=<email> Look up user by email address");
		process.exit(1);
	}

	let targetUserId = userId || "";

	// If email provided, look up user ID
	if (email && !userId) {
		const result = await prisma.$queryRaw<
			Array<{ id: string }>
		>`SELECT id FROM auth.users WHERE email = ${email} LIMIT 1`;

		if (result.length === 0) {
			console.error(`No user found with email: ${email}`);
			process.exit(1);
		}

		targetUserId = result[0].id;
		console.log(`Found user ID: ${targetUserId}`);
	}

	const existing = await prisma.adminUser.findUnique({
		where: { userId: targetUserId },
	});

	if (existing) {
		console.log(`Admin user already exists for userId: ${targetUserId}`);
		return;
	}

	await prisma.adminUser.create({
		data: {
			userId: targetUserId,
			isAdmin: true,
		},
	});

	console.log(`Admin user created successfully!`);
	console.log(`  userId: ${targetUserId}`);
	if (email) console.log(`  email: ${email}`);
	console.log("");
	console.log("The user will receive admin role on their next login.");
	console.log("To apply immediately, run this in Supabase SQL editor:");
	console.log(
		`  UPDATE auth.users SET updated_at = now() WHERE id = '${targetUserId}';`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
