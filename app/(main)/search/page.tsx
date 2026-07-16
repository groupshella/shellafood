import { Suspense } from "react";
import { SearchShell } from "@/features/search/components/SearchShell";
import { Modules } from "@/features/search/components/sections/Modules";
import { PopularBrands } from "@/features/search/components/sections/PopularBrands";
import { PopularSearch } from "@/features/search/components/sections/PopularSearch";
import { RecentSearches } from "@/features/search/components/sections/RecentSearches";
import { isArabicLocale } from "@/shared/lib/locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "البحث | شلة فود" : "Search | Shella Food",
		description: isArabic
			? "ابحث عن المنتجات والمتاجر والعلامات التجارية والعروض المتوفرة في شلة فود واستمتع بتجربة تسوق سهلة وسريعة."
			: "Search products, stores, brands, and offers on Shella Food for a fast shopping experience.",

		keywords: [
			"شلة فود",
			"Shella Food",
			isArabic ? "البحث" : "search",
			isArabic ? "البحث عن المنتجات" : "product search",
			isArabic ? "البحث عن المتاجر" : "store search",
			isArabic ? "العروض" : "offers",
			isArabic ? "المتاجر" : "stores",
			isArabic ? "السوبر ماركت" : "supermarket",
			isArabic ? "توصيل" : "delivery",
			isArabic ? "تسوق إلكتروني" : "online shopping",
		],

		alternates: {
			canonical: "/search",
		},

		openGraph: {
			type: "website",
			locale: isArabic ? "ar_SA" : "en_US",
			url: "https://shellafood.com/search",
			siteName: isArabic ? "شلة فود" : "Shella Food",
			title: isArabic ? "البحث | شلة فود" : "Search | Shella Food",
			description: isArabic
				? "ابحث عن المنتجات والمتاجر والعلامات التجارية والعروض المتوفرة في شلة فود."
				: "Search products, stores, brands, and offers on Shella Food.",
			images: [
				{
					url: "/images/og-image.png",
					width: 1200,
					height: 630,
					alt: isArabic ? "البحث في شلة فود" : "Search on Shella Food",
				},
			],
		},

		twitter: {
			card: "summary_large_image",
			title: isArabic ? "البحث | شلة فود" : "Search | Shella Food",
			description: isArabic
				? "ابحث عن المنتجات والمتاجر والعلامات التجارية والعروض المتوفرة في شلة فود."
				: "Search products, stores, brands, and offers on Shella Food.",
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
}

export default async function SearchRoute({
	searchParams,
}: {
	searchParams: Promise<{ module_id?: string }>;
}) {
	const isArabic = await isArabicLocale();
	const { module_id } = await searchParams;
	const activeModuleId = module_id && !Number.isNaN(Number(module_id)) ? module_id : "3";

	return (
		<SearchShell moduleId={activeModuleId} isArabic={isArabic}>
			<div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10 lg:mt-12 lg:gap-12">
				<Suspense fallback={<Modules.skeleton />}>
					<Modules isArabic={isArabic} />
				</Suspense>

				<RecentSearches />

				<Suspense fallback={<PopularSearch.skeleton />}>
					<PopularSearch moduleId={activeModuleId} isArabic={isArabic} />
				</Suspense>

				<Suspense fallback={<PopularBrands.skeleton />}>
					<PopularBrands moduleId={activeModuleId} isArabic={isArabic} />
				</Suspense>
			</div>
		</SearchShell>
	);
}
