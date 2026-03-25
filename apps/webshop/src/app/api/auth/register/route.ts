import { createClient } from "@supabase-lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email and password are required" },
			{ status: 400 },
		);
	}

	const supabase = await createClient();

	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.json({ user: data.user }, { status: 200 });
}
