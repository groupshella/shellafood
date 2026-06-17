import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import HomePage from "@/features/home/components/HomePage";
import { cookies } from "next/headers";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "شلة فود | منصة التوصيل والتسوق والخدمات الشاملة",
		template: "%s | شلة فود",
	},

	description:
		"شلة فود منصة متكاملة للتسوق والتوصيل والخدمات المنزلية. اطلب من المتاجر والمطاعم، تتبع طلباتك، استفد من العروض، واحصل على خدمات التوصيل والخدمات المنزلية بسهولة.",

	keywords: [
		"شلة فود",
		"Shella Food",
		"توصيل",
		"توصيل طلبات",
		"توصيل منتجات",
		"متاجر إلكترونية",
		"تسوق أونلاين",
		"السوبر ماركت",
		"العروض والخصومات",
		"توصيل سريع",
		"خدمات منزلية",
		"خدمني",
		"جلب وتوصيل",
		"طلبات",
		"توصيل السعودية",
		"متاجر غذائية",
		"توصيل البقالة",
	],

	applicationName: "Shella Food",

	authors: [
		{
			name: "Shella Food",
			url: "https://shellafood.com",
		},
	],

	creator: "Shella Food",
	publisher: "Shella Food",

	category: "Food & Delivery",

	metadataBase: new URL("https://shellafood.com"),

	alternates: {
		canonical: "/",
		languages: {
			ar: "/",
			en: "/en",
		},
	},

	openGraph: {
		type: "website",
		locale: "ar_SA",
		url: "https://shellafood.com",
		siteName: "شلة فود",
		title: "شلة فود | منصة التوصيل والتسوق والخدمات الشاملة",
		description:
			"اطلب من المتاجر والمطاعم، تتبع طلباتك، واستفد من خدمات التوصيل والخدمات المنزلية والعروض المميزة عبر شلة فود.",
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "Shella Food",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "شلة فود | منصة التوصيل والتسوق والخدمات الشاملة",
		description:
			"اطلب من المتاجر والمطاعم واستفد من خدمات التوصيل والخدمات المنزلية والعروض المميزة عبر شلة فود.",
		images: ["/images/og-image.png"],
	},

	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default async function HomeRoute() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

	return <HomePage isAuthenticated={token ? true : false} />
}