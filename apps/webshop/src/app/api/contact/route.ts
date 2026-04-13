import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialise Resend with the API key from .env.local
// RESEND_API_KEY must be set or emails will silently fail
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  // Basic validation — all four fields are required
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  try {
    const { error } = await resend.emails.send({
      // Resend requires a verified domain in production.
      // During development "onboarding@resend.dev" works fine.
      from: "The Digital Archivist <onboarding@resend.dev>",

      // Change this to your real inbox once domain is verified
      to: ["emelie.kedert@gmail.com",  
            "jim@jine.se", 
            "petra.oster.paulin@gmail.com", 
            "seanschelin@gmail.com",
            "cablejunkie@gmail.com"], 

      subject: `[Contact] ${subject}`,

      // Plain text email — easy to read, no HTML needed here
      text: `
New message from the contact form.

Name:    ${name}
Email:   ${email}
Subject: ${subject}

Message:
${message}
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}