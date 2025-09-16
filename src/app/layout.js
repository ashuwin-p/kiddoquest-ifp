import { Sour_Gummy } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const sourGummy = Sour_Gummy({
	variable: "--font-sour-gummy",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
title: "Kiddo Quest",
description: "Web app to develop life skills in children",
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<head>
</head>
<body className={`${sourGummy.variable} antialiased`}>
<AuthProvider>{children}</AuthProvider>
</body>
</html>
);
}
