import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
	try {
		const body = await request.json();
		const { name, email, password } = body || {};
		if (!email || !password) {
			return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
		}
		const normalizedEmail = String(email).toLowerCase().trim();
		const db = await getMongoDb(process.env.MONGODB_DB || "kiddoquest");
		const existing = await db.collection("users").findOne({ email: normalizedEmail });
		if (existing) {
			return NextResponse.json({ error: "Email already registered" }, { status: 409 });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = {
			name: name || "",
			email: normalizedEmail,
			passwordHash,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await db.collection("users").insertOne(user);
		return NextResponse.json({ success: true });
	} catch (err) {
		console.error("Register API error:", err);
		const msg = process.env.NODE_ENV === "production" ? "Unexpected error" : (err?.message || "Unexpected error");
		return NextResponse.json({ error: msg }, { status: 500 });
	}
} 