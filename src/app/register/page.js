"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});
		setLoading(false);
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			setError(data.error || "Registration failed");
			return;
		}
		router.push("/login");
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-secondary-50 via-accent-50 to-success-50 flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-colorful">
					<div className="text-center mb-8">
						<h1 className="font-display text-4xl text-secondary-500 mb-2">Create Account</h1>
						<p className="font-body text-gray-600">Join Kiddo Quest to start learning</p>
					</div>
					
					<form onSubmit={handleSubmit} className="space-y-6">
						{error ? (
							<div className="bg-pinkish-100 border border-pinkish-200 text-pinkish-700 px-4 py-3 rounded-xl">
								{error}
							</div>
						) : null}
						
						<div className="space-y-4">
							<div>
								<label className="block font-playful text-sm font-medium text-gray-700 mb-2">Name (optional)</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter your name"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
								/>
							</div>
							
							<div>
								<label className="block font-playful text-sm font-medium text-gray-700 mb-2">Email</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
									required
								/>
							</div>
							
							<div>
								<label className="block font-playful text-sm font-medium text-gray-700 mb-2">Password</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Create a password (min 6 characters)"
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 transition-all duration-200"
									minLength={6}
									required
								/>
							</div>
						</div>
						
						<button 
							type="submit" 
							disabled={loading} 
							className="w-full bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 text-white font-playful text-lg py-3 rounded-xl shadow-colorful transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
						>
							{loading ? "Creating..." : "Create Account"}
						</button>
						
						<p className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<a href="/login" className="text-primary-500 hover:text-primary-600 font-medium underline">Sign in here</a>
						</p>
					</form>
				</div>
			</div>
		</main>
	);
}
