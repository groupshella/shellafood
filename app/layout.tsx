import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
	title: "شلة فود",
	description: "منصة التوصيل والخدمات الشاملة",
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	metadataBase: new URL("https://shellafood.com"),
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ar" dir="rtl" suppressHydrationWarning>
			<body
			>
				<main className="min-h-dvh">{children}</main>
			</body>
		</html>
	);
}
