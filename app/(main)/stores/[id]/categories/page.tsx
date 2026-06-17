import CategoriesPage from "@/features/categories/components/CategoriesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "تصنيفات المتجر | شلة فود",
	description:
		"تصفح تصنيفات المتجر والأقسام الفرعية والمنتجات والعروض المتوفرة عبر شلة فود.",

	keywords: [
		"شلة فود",
		"Shella Food",
		"تصنيفات",
		"أقسام المتجر",
		"منتجات",
		"عروض",
		"خصومات",
		"توصيل",
		"تسوق إلكتروني",
	],

	alternates: {
		canonical: "/store/categories",
	},

	openGraph: {
		type: "website",
		locale: "ar_SA",
		url: "https://shellafood.com/store/categories",
		siteName: "شلة فود",
		title: "تصنيفات المتجر | شلة فود",
		description:
			"تصفح تصنيفات المتجر والأقسام الفرعية والمنتجات والعروض المتوفرة عبر شلة فود.",
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "تصنيفات المتجر",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "تصنيفات المتجر | شلة فود",
		description:
			"تصفح تصنيفات المتجر والأقسام الفرعية والمنتجات والعروض المتوفرة عبر شلة فود.",
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

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ categoryId?: string }>;
}

export default async function Page({
	params,
	searchParams,
}: PageProps) {
	const { id: storeId } = await params;
	const { categoryId } = await searchParams;

	return (
		<CategoriesPage
			storeId={storeId}
			initialCategoryId={categoryId ?? null}
		/>
	);
}