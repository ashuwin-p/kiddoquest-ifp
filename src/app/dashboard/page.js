"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
	const { data: session } = useSession();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [savingName, setSavingName] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [changingPass, setChangingPass] = useState(false);
	const [message, setMessage] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);

	useEffect(() => {
		async function loadProfile() {
			const res = await fetch("/api/profile");
			if (res.ok) {
				const data = await res.json();
				setName(data.user?.name || "");
				setEmail(data.user?.email || "");
			}
		}
		loadProfile();
	}, []);

	async function updateName(e) {
		e.preventDefault();
		setMessage("");
		setSavingName(true);
		const res = await fetch("/api/profile", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name }),
		});
		setSavingName(false);
		if (res.ok) setMessage("Name updated");
		else setMessage("Failed to update name");
	}

	async function changePassword(e) {
		e.preventDefault();
		setMessage("");
		setChangingPass(true);
		const res = await fetch("/api/profile/password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ currentPassword, newPassword }),
		});
		setChangingPass(false);
		if (res.ok) setMessage("Password changed");
		else {
			const data = await res.json().catch(() => ({}));
			setMessage(data.error || "Failed to change password");
		}
		setCurrentPassword("");
		setNewPassword("");
	}

	async function deleteAccount() {
		if (!confirm("Are you sure? This cannot be undone.")) return;
		setMessage("");
		const res = await fetch("/api/profile/delete", { method: "DELETE" });
		if (res.ok) {
			setMessage("Account deleted");
			await signOut({ callbackUrl: "/" });
		} else {
			setMessage("Failed to delete account");
		}
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-secondary-50 via-accent-50 to-success-50">
			{/* Top bar */}
			<header className="h-14 bg-white/80 backdrop-blur-sm border-b flex items-center px-4 justify-between shadow-sm">
				<div className="flex items-center gap-3">
					<button
						aria-label="Toggle sidebar"
						className="md:hidden p-2 border rounded-xl"
						onClick={() => setSidebarOpen((v) => !v)}
					>
						<span className="block w-5 h-0.5 bg-primary-500 mb-1" />
						<span className="block w-5 h-0.5 bg-primary-500 mb-1" />
						<span className="block w-5 h-0.5 bg-primary-500" />
					</button>
					<h1 className="text-xl font-display text-primary-600">
						Dashboard
					</h1>
				</div>
				<div className="hidden md:block text-sm text-gray-600">
					{email || session?.user?.email}
				</div>
			</header>

			<div className="flex">
				{/* Sidebar */}
				<aside
					className={`${
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					} md:translate-x-0 transition-transform duration-200 w-64 border-r min-h-[calc(100vh-3.5rem)] p-4 bg-white/90 backdrop-blur-sm fixed md:static z-20`}
				>
					<nav className="space-y-2">
						<button
							className="w-full text-left px-3 py-2 rounded-xl hover:bg-secondary-50"
							onClick={() => {
								setProfileOpen(true);
								setSidebarOpen(false);
							}}
						>
							Manage Profile
						</button>
						<button
							className="w-full text-left px-3 py-2 rounded-xl text-primary-600 hover:bg-primary-50"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							Logout
						</button>
					</nav>
				</aside>

				{/* Main content */}
				<section className="flex-1">
					<div className="max-w-6xl mx-auto p-6">
						<h2 className="text-2xl font-display text-secondary-600 mb-4">
							Games
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="bg-white/80 backdrop-blur-sm border rounded-3xl p-4 flex flex-col shadow-playful hover:shadow-colorful transition-transform duration-200 hover:-translate-y-1"
								>
									{i === 0 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Road Safety"
													style={{ fontSize: 40 }}
												>
													🚦
												</span>
											</div>
											<h3 className="font-semibold mb-1">
												Road Safety Game
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Learn traffic signals and signs
												by matching!
											</p>
											<a
												href="/road-safety-game"
												className="mt-auto px-3 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : i === 1 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-success-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Waste Sorting"
													style={{ fontSize: 40 }}
												>
													🗑️
												</span>
											</div>
											<h3 className="font-semibold mb-1">
												Waste Sorting Game
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Sort waste into the correct bins
												and become an EcoHero!
											</p>
											<a
												href="/waste-sorting-game"
												className="mt-auto px-3 py-2 rounded-xl bg-success-500 hover:bg-success-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : i === 2 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-pinkish-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Life Skills"
													style={{ fontSize: 40 }}
												>
													🌱
												</span>
											</div>
											<h3 className="font-semibold mb-1">
												Life Skills Quest
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Make choices to build your
												character and life skills!
											</p>
											<a
												href="/life-skills-quest"
												className="mt-auto px-3 py-2 rounded-xl bg-pinkish-500 hover:bg-pinkish-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : i === 3 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-purple-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Memory Game"
													style={{ fontSize: 40 }}
												>
													🧠
												</span>
											</div>
											<h3 className="font-semibold mb-1">Memory Game</h3>
											<p className="text-sm text-gray-600 mb-3">
												Match pairs to strengthen memory.
											</p>
											<a
												href="/memory-game"
												className="mt-auto px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : i === 4 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-yellow-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span role="img" aria-label="Lock Guesser" style={{ fontSize: 40 }}>🔐</span>
											</div>
											<h3 className="font-semibold mb-1">Lock Guesser</h3>
											<p className="text-sm text-gray-600 mb-3">Guess the combo with higher/lower hints.</p>
											<a href="/lock-guesser" className="mt-auto px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-center">Play</a>
										</>
									) : i === 5 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-indigo-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Word Scramble"
													style={{ fontSize: 40 }}
												>
													🔤
												</span>
											</div>
											<h3 className="font-semibold mb-1">
												Word Scramble
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Unscramble words to test your vocabulary and spelling skills!
											</p>
											<a
												href="/word-scramble-game"
												className="mt-auto px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : i === 6 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-orange-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Community Helpers"
													style={{ fontSize: 40 }}
												>
													👥
												</span>
											</div>
											<h3 className="font-semibold mb-1">
												Community Helpers
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Play as Firefighter, Doctor, or Teacher in mini-quests that teach responsibility!
											</p>
											<a
												href="/community-helpers"
												className="mt-auto px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : i === 7 ? (
										<>
											<div className="h-28 bg-gradient-to-br from-amber-50 to-accent-50 rounded-2xl mb-3 flex items-center justify-center">
												<span
													role="img"
													aria-label="Healthy Habits"
													style={{ fontSize: 40 }}
												>
													🥦
												</span>
											</div>
											<h3 className="font-semibold mb-1">Healthy Habits</h3>
											<p className="text-sm text-gray-600 mb-3">
												Tap good habits, avoid bad ones, and beat the timer!
											</p>
											<a
												href="/healthy-habits-game"
												className="mt-auto px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-center"
											>
												Play
											</a>
										</>
									) : (
										<>
											<div className="h-28 bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl mb-3" />
											<h3 className="font-semibold mb-1">
												Game {i + 1}
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Fun activity to build life
												skills.
											</p>
											<button className="mt-auto px-3 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white">
												Play
											</button>
										</>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			</div>

			{/* Slide-over Manage Profile */}
			{profileOpen ? (
				<div className="fixed inset-0 z-30">
					<div
						className="absolute inset-0 bg-black/30"
						onClick={() => setProfileOpen(false)}
					/>
					<div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl p-6 overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-display text-secondary-600">
								Manage Profile
							</h3>
							<button
								className="p-2 border rounded-xl"
								onClick={() => setProfileOpen(false)}
							>
								Close
							</button>
						</div>

						{message ? (
							<p className="text-sm text-blue-700 mb-3">
								{message}
							</p>
						) : null}

						<section className="mb-6">
							<h4 className="font-medium mb-2">Update Name</h4>
							<form
								onSubmit={updateName}
								className="space-y-2"
							>
								<input
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200"
								/>
								<button
									type="submit"
									disabled={savingName}
									className="px-3 py-2 rounded-xl bg-secondary-500 hover:bg-secondary-600 text-white"
								>
									{savingName ? "Saving..." : "Save"}
								</button>
							</form>
						</section>

						<section className="mb-6">
							<h4 className="font-medium mb-2">
								Change Password
							</h4>
							<form
								onSubmit={changePassword}
								className="space-y-2"
							>
								<input
									type="password"
									placeholder="Current password"
									value={currentPassword}
									onChange={(e) =>
										setCurrentPassword(e.target.value)
									}
									className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200"
								/>
								<input
									type="password"
									placeholder="New password"
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200"
								/>
								<button
									type="submit"
									disabled={changingPass}
									className="px-3 py-2 rounded-xl bg-success-500 hover:opacity-90 text-white"
								>
									{changingPass
										? "Changing..."
										: "Change Password"}
								</button>
							</form>
						</section>

						<section>
							<h4 className="font-medium mb-2 text-red-700">
								Delete Account
							</h4>
							<button
								onClick={deleteAccount}
								className="px-3 py-2 rounded-xl border border-red-600 text-red-700"
							>
								Delete my account
							</button>
						</section>
					</div>
				</div>
			) : null}
		</main>
	);
}
