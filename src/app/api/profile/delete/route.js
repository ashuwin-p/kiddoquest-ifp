import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";

export async function DELETE(request) {
	const { authenticated, token } = await requireAuth(request);
	if (!authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const db = await getMongoDb(process.env.MONGODB_DB || "kiddoquest");
	await db.collection("users").deleteOne({ email: token.email });
	return NextResponse.json({ success: true });
} 