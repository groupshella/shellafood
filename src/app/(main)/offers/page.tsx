import { Metadata } from "next";
import { OffersListingClient } from "@/features/offers";

export const metadata: Metadata = {
	title: "العروض الخاصة | شلة فود",
	description:
		"اكتشف العروض الحصرية والخصومات والعروض الخاصة على خدمات التوصيل والنقل. وفر الكثير مع عروضنا المحدودة الوقت!",
	keywords: [
		"عروض",
		"خصومات",
		"عروض خاصة",
		"شلة فود",
		"توصيل الطعام",
		"عروض محدودة",
		"توفير",
		"عروض حصرية",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "العروض الخاصة | شلة فود",
		description:
			"اكتشف العروض الحصرية والخصومات والعروض الخاصة على خدمات التوصيل والنقل. وفر الكثير مع عروضنا المحدودة الوقت!",
		type: "website",
		url: "https://shellafood.com/offers",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-offers.jpg",
				width: 1200,
				height: 630,
				alt: "العروض الخاصة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "العروض الخاصة | شلة فود",
		description:
			"اكتشف العروض الحصرية والخصومات والعروض الخاصة على خدمات التوصيل والنقل.",
		images: ["/og-offers.jpg"],
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
		canonical: "https://shellafood.com/offers",
		languages: {
			"ar-SA": "https://shellafood.com/offers",
			"en-US": "https://shellafood.com/offers",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function OffersPageRoute() {
	return <OffersListingClient />;
}
