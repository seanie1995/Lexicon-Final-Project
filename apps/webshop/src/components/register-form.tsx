"use client";

import { createClient } from "@supabase-lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

const RegisterForm = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError("");
	};

	const handleGoogleSignIn = async () => {
		const supabase = createClient();
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (
			!formData.fullName ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword
		) {
			setError("All fields are required");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					fullName: formData.fullName,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Registration failed");
				return;
			}

			router.push("/register/success");
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const inputClasses =
		"w-full px-4 py-3 bg-surface-container-low border border-outline/40 text-on-surface font-label text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-300 placeholder:text-outline/50 disabled:opacity-50 disabled:cursor-not-allowed";
	const labelClasses =
		"block text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2";

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="bg-surface-container-lowest p-8 md:p-12 border border-outline-variant/10 shadow-2xl">
				<h1 className="text-2xl font-serif text-primary mb-2">
					Create Account
				</h1>
				<p className="text-on-surface-variant font-body text-sm mb-8">
					Join The Digital Archivist to unlock exclusive rarities and curations.
				</p>

				{error && (
					<div className="mb-6 p-3 bg-error-container text-on-error-container text-sm font-label">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="fullName" className={labelClasses}>
							Full Name
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={formData.fullName}
							onChange={handleChange}
							placeholder="Enter your name"
							disabled={isLoading}
							className={inputClasses}
						/>
					</div>

					<div>
						<label htmlFor="email" className={labelClasses}>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="your@email.com"
							disabled={isLoading}
							className={inputClasses}
						/>
					</div>

					<div>
						<label htmlFor="password" className={labelClasses}>
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Create a password"
								disabled={isLoading}
								className={inputClasses}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					<div>
						<label htmlFor="confirmPassword" className={labelClasses}>
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirm your password"
								disabled={isLoading}
								className={inputClasses}
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
								tabIndex={-1}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 bg-primary text-on-primary font-label uppercase tracking-wider text-sm hover:cursor-pointer hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Creating Account...
							</>
						) : (
							"Create Account"
						)}
					</button>
				</form>

				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-outline/30" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-surface-container-lowest px-4 text-on-surface-variant font-label">
							OR
						</span>
					</div>
				</div>

				<button
					type="button"
					onClick={handleGoogleSignIn}
					disabled={isLoading}
					className="w-full py-3 bg-surface-container-low border border-outline/40 text-on-surface font-label uppercase tracking-wider text-sm hover:bg-surface-container hover:border-outline/60 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						aria-label="Google logo"
						role="img"
					>
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					Continue with Google
				</button>

				<p className="mt-6 text-center text-sm text-on-surface-variant font-body">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary font-semibold hover:underline underline-offset-4"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
