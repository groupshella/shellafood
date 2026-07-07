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
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var d=localStorage.getItem('shellafood-dark-mode')==='true';document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
					}}
				/>
			</head>
			<body>
				<main className="min-h-dvh bg-white dark:bg-gray-900">{children}</main>
			</body>
		</html>
	);
}
