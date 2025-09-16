import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getMongoDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { email, password } = credentials || {};
				if (!email || !password) return null;
				const db = await getMongoDb(process.env.MONGODB_DB || "kiddoquest");
				const user = await db.collection("users").findOne({ email: email.toLowerCase() });
				if (!user || !user.passwordHash) return null;
				const valid = await bcrypt.compare(password, user.passwordHash);
				if (!valid) return null;
				return { id: String(user._id), name: user.name || "", email: user.email };
			},
		}),
	],
	session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 10 },
	jwt: { maxAge: 60 * 60 * 24 * 10 },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user = {
					id: token.id,
					name: token.name,
					email: token.email,
				};
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 