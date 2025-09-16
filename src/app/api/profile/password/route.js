import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
	const { authenticated, token } = await requireAuth(request);
	if (!authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json();
	const { currentPassword, newPassword } = body || {};
	if (!currentPassword || !newPassword) {
		return NextResponse.json({ error: "Current and new password required" }, { status: 400 });
	}
	const db = await getMongoDb(process.env.MONGODB_DB || "kiddoquest");
	const user = await db.collection("users").findOne({ email: token.email });
	if (!user || !user.passwordHash) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}
	const valid = await bcrypt.compare(currentPassword, user.passwordHash);
	if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
	const passwordHash = await bcrypt.hash(newPassword, 10);
	await db.collection("users").updateOne({ _id: user._id }, { $set: { passwordHash, updatedAt: new Date() } });
	return NextResponse.json({ success: true });
} 