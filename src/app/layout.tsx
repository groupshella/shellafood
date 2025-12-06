import { GeistMono, GeistSans } from "geist/font";
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/providers";
import { ThemeProvider } from "@/providers";
import { NavBarCondition } from "@/features/profile";
import { ShellaFooter } from "@/shared/components";

export const metadata: Metadata = {
	title: "شلة فود",
	description: "منصة التوصيل والخدمات الشاملة",
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	metadataBase: new URL("https://shellafood.com"),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ar" dir="rtl" suppressHydrationWarning>
			<body
				className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
			>
				<ThemeProvider>
					<LanguageProvider>
						{/* Navigation - Unified for all routes */}
						<NavBarCondition />
						{/* Main Content */}
						<main className="min-h-screen bg-white dark:bg-gray-900">
							{children}
						</main>
						{/* Footer - Unified for all routes */}
						<ShellaFooter />
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
