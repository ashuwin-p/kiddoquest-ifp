"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});
		setLoading(false);
		if (!res || res.error) {
			setError("Invalid email or password");
			return;
		}
		window.location.href = "/dashboard";
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-colorful">
					<div className="text-center mb-8">
						<h1 className="font-display text-4xl text-primary-500 mb-2">Welcome Back</h1>
						<p className="font-body text-gray-600">Sign in to continue your adventure</p>
					</div>
					
					<form onSubmit={handleSubmit} className="space-y-6">
						{error ? (
							<div className="bg-pinkish-100 border border-pinkish-200 text-pinkish-700 px-4 py-3 rounded-xl">
								{error}
							</div>
						) : null}
						
						<div className="space-y-4">
							<div>
								<label className="block font-playful text-sm font-medium text-gray-700 mb-2">Email</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
									required
								/>
							</div>
							
							<div>
								<label className="block font-playful text-sm font-medium text-gray-700 mb-2">Password</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
									required
								/>
							</div>
						</div>
						
						<button 
							type="submit" 
							disabled={loading} 
							className="w-full bg-gradient-to-r from-primary-500 to-pinkish-500 hover:from-primary-600 hover:to-pinkish-600 text-white font-playful text-lg py-3 rounded-xl shadow-colorful transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
						
						<p className="text-center text-sm text-gray-600">
							Don't have an account?{" "}
							<a href="/register" className="text-secondary-500 hover:text-secondary-600 font-medium underline">Create one here</a>
						</p>
					</form>
				</div>
			</div>
		</main>
	);
}
