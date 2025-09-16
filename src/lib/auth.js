import { getToken } from "next-auth/jwt";

export async function requireAuth(request) {
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	if (!token || !token.email || !token.id) {
		return { authenticated: false, token: null };
	}
	return { authenticated: true, token };
} 