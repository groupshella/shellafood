import { Metadata } from "next";
import { cookies } from "next/headers";
import { HomePage } from "@/features/home";
import { ZoneDataModule } from "@/features/categories/types/module.types";
import { getCachedZoneData } from "@/features/categories/api/modules.api";
import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";

export const metadata: Metadata = {
	title: "الصفحة الرئيسية | شلة فود - منصة التسوق والتوصيل الرائدة",
	description:
		"اكتشف أفضل المتاجر والمطاعم في منطقتك مع شلة فود. تسوق من سوبرماركت، مطاعم، صيدليات وأكثر. توصيل سريع وموثوق إلى باب منزلك مع أفضل الأسعار والعروض.",
	keywords: [
		"شلة فود",
		"تسوق أونلاين",
		"توصيل طعام",
		"توصيل سريع",
		"مطاعم",
		"سوبرماركت",
		"صيدليات",
		"متاجر قريبة",
		"خصومات",
		"عروض",
		"تسوق إلكتروني",
		"توصيل مجاني",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الصفحة الرئيسية | شلة فود",
		description:
			"اكتشف أفضل المتاجر والمطاعم في منطقتك مع شلة فود. تسوق من سوبرماركت، مطاعم، صيدليات وأكثر. توصيل سريع وموثوق إلى باب منزلك.",
		type: "website",
		url: "https://shellafood.com/home",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-home.jpg",
				width: 1200,
				height: 630,
				alt: "شلة فود - منصة التسوق والتوصيل",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الصفحة الرئيسية | شلة فود",
		description:
			"اكتشف أفضل المتاجر والمطاعم في منطقتك مع شلة فود. توصيل سريع وموثوق إلى باب منزلك.",
		images: ["/og-home.jpg"],
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
		canonical: "https://shellafood.com/home",
		languages: {
			"ar-SA": "https://shellafood.com/home",
			"en-US": "https://shellafood.com/home",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default async function HomePageRoute() {
	// const cookieStore = await cookies();
	// const locationCookie = cookieStore.get('location')?.value;

	let latitude = parseFloat('24.540766366665999');
	let longitude = parseFloat('46.504590739370002');
	const locale = DEFAULT_LANG;

// 	if (locationCookie) {
// 			const parsed = JSON.parse(locationCookie);
// 			if (!isNaN(parsed.lat) && !isNaN(parsed.lng)) {
// 				latitude = parseFloat(parsed.lat);
// 				longitude = parseFloat(parsed.lng);
// 	}
// }
	const zoneData = await getCachedZoneData(latitude, longitude, locale);

	const zoneModules = zoneData?.zone_data?.[0]?.modules
	return (
		<HomePage modules={zoneModules as ZoneDataModule[]}/>
	);
}

