import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
	const { authenticated, token } = await requireAuth(request);
	if (!authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const db = await getMongoDb(process.env.MONGODB_DB || "kiddoquest");
	const user = await db.collection("users").findOne({ email: token.email }, { projection: { passwordHash: 0 } });
	return NextResponse.json({ user });
}

export async function PATCH(request) {
	const { authenticated, token } = await requireAuth(request);
	if (!authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json();
	const name = String(body?.name || "").trim();
	const db = await getMongoDb(process.env.MONGODB_DB || "kiddoquest");
	await db.collection("users").updateOne({ email: token.email }, { $set: { name, updatedAt: new Date() } });
	return NextResponse.json({ success: true });
} 