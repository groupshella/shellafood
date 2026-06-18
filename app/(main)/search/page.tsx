import SearchPage from "@/features/search/components/SearchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "البحث | شلة فود",
	description:
		"ابحث عن المنتجات والمتاجر والعلامات التجارية والعروض المتوفرة في شلة فود واستمتع بتجربة تسوق سهلة وسريعة.",

	keywords: [
		"شلة فود",
		"Shella Food",
		"البحث",
		"البحث عن المنتجات",
		"البحث عن المتاجر",
		"العروض",
		"المتاجر",
		"السوبر ماركت",
		"توصيل",
		"تسوق إلكتروني",
	],

	alternates: {
		canonical: "/search",
	},

	openGraph: {
		type: "website",
		locale: "ar_SA",
		url: "https://shellafood.com/search",
		siteName: "شلة فود",
		title: "البحث | شلة فود",
		description:
			"ابحث عن المنتجات والمتاجر والعلامات التجارية والعروض المتوفرة في شلة فود.",
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "البحث في شلة فود",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "البحث | شلة فود",
		description:
			"ابحث عن المنتجات والمتاجر والعلامات التجارية والعروض المتوفرة في شلة فود.",
		images: ["/images/og-image.png"],
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
};

export default async function SearchRoute({
	searchParams,
}: {
	searchParams: Promise<{ module_id: string }>;
}) {
	const { module_id } = await searchParams;

	return <SearchPage moduleId={module_id} />;
}