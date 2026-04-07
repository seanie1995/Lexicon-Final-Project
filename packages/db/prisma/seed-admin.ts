import { prisma } from "../src";

async function main() {
	const args = process.argv.slice(2);
	const userId = args.find((arg) => arg.startsWith("--user="))?.split("=")[1];
	const email = args.find((arg) => arg.startsWith("--email="))?.split("=")[1];

	if (!userId && !email) {
		console.log(
			"Usage: npx tsx seed-admin.ts --user=<supabase_user_id> [--email=<user_email>]",
		);
		console.log("");
		console.log("Options:");
		console.log(
			"  --user=<id>    Supabase auth user ID (from Supabase Dashboard)",
		);
		console.log("  --email=<email> Optional: email for logging");
		process.exit(1);
	}

	const targetUserId = userId || "";

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
	console.log(
		"To apply immediately, run: UPDATE auth.users SET updated_at = now() WHERE id = '<user_id>' in Supabase SQL editor.",
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
