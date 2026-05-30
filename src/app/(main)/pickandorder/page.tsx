import { Metadata } from "next";
import { PickAndOrder } from "@/features/pick-and-order";

export const metadata: Metadata = {
	title: "Pick & Order | شلة فود - خدمة التوصيل السريع",
	description:
		"خدمة توصيل سريعة وموثوقة. اختر نوع النقل المناسب واترك الباقي علينا. توصيل سريع وآمن مع تتبع مباشر للشحنة.",
	keywords: [
		"توصيل",
		"خدمة توصيل",
		"توصيل سريع",
		"دراجة نارية",
		"شاحنة",
		"pick and order",
		"delivery service",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "Pick & Order | شلة فود - خدمة التوصيل السريع",
		description:
			"خدمة توصيل سريعة وموثوقة. اختر نوع النقل المناسب واترك الباقي علينا. توصيل سريع وآمن مع تتبع مباشر للشحنة.",
		type: "website",
		url: "https://shellafood.com/pickandorder",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-pickandorder.jpg",
				width: 1200,
				height: 630,
				alt: "Pick & Order - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Pick & Order | شلة فود - خدمة التوصيل السريع",
		description:
			"خدمة توصيل سريعة وموثوقة. اختر نوع النقل المناسب واترك الباقي علينا.",
		images: ["/og-pickandorder.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/pickandorder",
		languages: {
			"ar-SA": "https://shellafood.com/pickandorder",
			"en-US": "https://shellafood.com/pickandorder",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function PickAndOrderPageRoute() {
	return <PickAndOrder />;
}


