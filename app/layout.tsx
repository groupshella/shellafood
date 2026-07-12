import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
	title: "شيلة فود",
	description: "منصة التوصيل والتسوق الإلكتروني — هايبر ماركت ومتاجر في منطقتك",
	authors: [{ name: "شيلة فود" }],
	creator: "شيلة فود",
	publisher: "شيلة فود",
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
			{/* Dark mode: apply saved preference before first paint */}
			<script
				dangerouslySetInnerHTML={{
					__html: `(function(){try{var d=localStorage.getItem('shellafood-dark-mode')==='true';document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
				}}
			/>
			{/* Language: apply saved lang/dir before first paint to prevent flash */}
			<script
				dangerouslySetInnerHTML={{
					__html: `(function(){try{var l=localStorage.getItem('shellafood-lang');if(l==='ar'||l==='en'){document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}}catch(e){}})()`,
				}}
			/>
		</head>
			<body>
				<main className="min-h-dvh bg-white dark:bg-gray-900">{children}</main>
			</body>
		</html>
	);
}
