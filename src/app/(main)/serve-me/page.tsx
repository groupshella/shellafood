import { Metadata } from "next";
import { ServeMe } from "@/features/serve-me";

export const metadata: Metadata = {
	title: "اخدمني | شلة فود - خدمات متنوعة على مدار الساعة",
	description:
		"خدمة اخدمني من شلة فود - احصل على خدمات التوصيل والمساعدة الفورية في جميع احتياجاتك اليومية. خدمات متنوعة ومتاحة على مدار الساعة مع عمال محترفين.",
	keywords: [
		"اخدمني",
		"شلة فود",
		"خدمات",
		"توصيل",
		"مساعدة",
		"خدمة العملاء",
		"خدمات متنوعة",
		"عمال محترفين",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "اخدمني | شلة فود",
		description:
			"خدمة اخدمني من شلة فود - احصل على خدمات التوصيل والمساعدة الفورية في جميع احتياجاتك اليومية.",
		type: "website",
		url: "https://shellafood.com/serve-me",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-serve-me.jpg",
				width: 1200,
				height: 630,
				alt: "اخدمني - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "اخدمني | شلة فود",
		description:
			"خدمة اخدمني من شلة فود - احصل على خدمات التوصيل والمساعدة الفورية في جميع احتياجاتك اليومية.",
		images: ["/og-serve-me.jpg"],
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
		canonical: "https://shellafood.com/serve-me",
		languages: {
			"ar-SA": "https://shellafood.com/serve-me",
			"en-US": "https://shellafood.com/serve-me",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function ServeMePageRoute() {
	return <ServeMe />;
}

