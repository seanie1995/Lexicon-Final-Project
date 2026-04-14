"use client";

import { createClient } from "@supabase-lib/supabase/client";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useEffect, useState } from "react";

const LoginFormContent = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const justRegistered = searchParams.get("registered") === "true";
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showRegisteredMessage, setShowRegisteredMessage] =
		useState(justRegistered);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	useEffect(() => {
		if (justRegistered) {
			setShowRegisteredMessage(true);
		}
	}, [justRegistered]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError("");
		setShowRegisteredMessage(false);
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

		if (!formData.email || !formData.password) {
			setError("Email and password are required");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Login failed");
				return;
			}

			// Sync the session to the browser-side Supabase client so that
			// onAuthStateChange fires in the header without a page refresh.
			if (data.session) {
				const supabase = createClient();
				await supabase.auth.setSession({
					access_token: data.session.access_token,
					refresh_token: data.session.refresh_token,
				});
			}

			router.push("/");
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
				<h1 className="text-2xl font-serif text-primary mb-2">Welcome Back</h1>
				<p className="text-on-surface-variant font-body text-sm mb-8">
					Sign in to your account to continue.
				</p>

				{/* Success message — announced to screen readers via role="alert" */}
				{showRegisteredMessage && (
					<div
						role="alert"
						className="mb-6 p-3 bg-primary-fixed text-on-primary-fixed-variant text-sm font-label flex items-center gap-2"
					>
						<CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
						Your account has been created. Please verify your email before
						signing in.
					</div>
				)}

				{/* Error message — role="alert" means screen readers announce this immediately */}
				{error && (
					<div
						role="alert"
						aria-live="polite"
						className="mb-6 p-3 bg-error-container text-on-error-container text-sm font-label"
					>
						{error}
					</div>
				)}

				{/* aria-label gives screen readers context for the whole form */}
				<form
					onSubmit={handleSubmit}
					aria-label="Sign in form"
					className="space-y-6"
				>
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
							autoComplete="email"
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
								placeholder="Enter your password"
								disabled={isLoading}
								autoComplete="current-password"
								className={inputClasses}
							/>
							{/* aria-label tells screen readers what this button does */}
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" aria-hidden="true" />
								) : (
									<Eye className="h-5 w-5" aria-hidden="true" />
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
								<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
								Signing in...
							</>
						) : (
							"Sign In"
						)}
					</button>
				</form>

				<div className="relative my-6" aria-hidden="true">
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
					aria-label="Continue with Google"
					className="w-full py-3 bg-surface-container-low border border-outline/40 text-on-surface font-label uppercase tracking-wider text-sm hover:bg-surface-container hover:border-outline/60 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
				>
					<svg
						className="h-5 w-5"
						viewBox="0 0 24 24"
						aria-hidden="true"
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
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="text-primary font-semibold hover:underline underline-offset-4"
					>
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
};

const LoginForm = () => {
	return (
		<Suspense
			fallback={
				<div className="w-full max-w-md mx-auto p-8 bg-surface-container-lowest border border-outline-variant/10 shadow-2xl">
					Loading...
				</div>
			}
		>
			<LoginFormContent />
		</Suspense>
	);
};

export default LoginForm;
