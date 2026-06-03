import { GeistMono, GeistSans } from "geist/font";
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
				className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
			>
				<main className="min-h-screen bg-white dark:bg-gray-900">
					{children}
				</main>
			</body>
		</html>
	);
}
