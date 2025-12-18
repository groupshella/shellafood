import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getCachedZoneData } from "@/features/categories/api/modules.api";
import { ZoneDataModule } from "@/features/categories/types/module.types";
import { CategoriesPage } from "@/features/categories/components/category-list";
import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";

// ✅ Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Re-generate page every hour


export const metadata: Metadata = {
	title: "الأقسام | شلة فود",
	description:
		"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر. اكتشف أفضل المتاجر في كل قسم واحصل على توصيل سريع.",
	keywords: [
		"أقسام شلة فود",
		"مطاعم",
		"سوبرماركت",
		"صيدليات",
		"العناية بالحيوانات",
		"هايبر شلة",
		"متاجر",
		"تسوق",
		"توصيل الطعام",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الأقسام | شلة فود",
		description:
			"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر. اكتشف أفضل المتاجر في كل قسم.",
		type: "website",
		url: "https://shellafood.com/categories",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-categories.jpg",
				width: 1200,
				height: 630,
				alt: "أقسام شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الأقسام | شلة فود",
		description:
			"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر.",
		images: ["/og-categories.jpg"],
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
		canonical: "https://shellafood.com/categories",
		languages: {
			"ar-SA": "https://shellafood.com/categories",
			"en-US": "https://shellafood.com/categories",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};



export default async function CategoriesPageRoute() {
	const cookieStore = await cookies();
	const locationCookie = cookieStore.get('location')?.value;

	let latitude = parseFloat('24.540766366665999');
	let longitude = parseFloat('46.504590739370002');
	const locale = DEFAULT_LANG;

	if (locationCookie) {
	
			const parsed = JSON.parse(locationCookie);
			if (!isNaN(parsed.lat) && !isNaN(parsed.lng)) {
				latitude = parseFloat(parsed.lat);
				longitude = parseFloat(parsed.lng);
			}
	}
	const pageStartTime = Date.now();
	const zoneData = await getCachedZoneData(latitude, longitude, locale);
	const pageDuration = Date.now() - pageStartTime;
	console.log('[Categories Page] Fetch duration:', `${pageDuration}ms`);

	const zoneModules = zoneData?.zone_data?.[0]?.modules || [];
	
	// Log for debugging in production
	if (!zoneData || zoneModules.length === 0) {
		console.error('[Categories Page] No zone data or modules found:', {
			hasZoneData: !!zoneData,
			zoneDataLength: zoneData?.zone_data?.length || 0,
			modulesCount: zoneModules.length,
			BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'not set',
		});
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* ✅ Component receives data immediately, no loading state needed */}
			<CategoriesPage 
				initialModules={zoneModules as ZoneDataModule[]} 
			/>
		</div>
	);
}


