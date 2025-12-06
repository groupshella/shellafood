import { Metadata } from "next";
import { DriverProfilePage } from "@/features/driver";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ driverId: string }>;
}): Promise<Metadata> {
	const { driverId } = await params;

	return {
		title: `ملف السائق | شلة فود`,
		description: `عرض ملف السائق والتواصل معه. تعرف على تفاصيل السائق وتقييماته واختره لتوصيل طلباتك.`,
		keywords: [
			"ملف السائق",
			"سائق",
			"توصيل",
			"شلة فود",
			"تقييم السائق",
			"سائق موثوق",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `ملف السائق | شلة فود`,
			description: `عرض ملف السائق والتواصل معه. تعرف على تفاصيل السائق وتقييماته واختره لتوصيل طلباتك.`,
			type: "website",
			url: `https://shellafood.com/driver/${driverId}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `ملف السائق | شلة فود`,
			description: `عرض ملف السائق والتواصل معه. تعرف على تفاصيل السائق وتقييماته.`,
			creator: "@shellafood",
		},
		robots: {
			index: false,
			follow: true,
			googleBot: {
				index: false,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `https://shellafood.com/driver/${driverId}`,
			languages: {
				"ar-SA": `https://shellafood.com/driver/${driverId}`,
				"en-US": `https://shellafood.com/driver/${driverId}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function DriverProfilePageRoute({
	params,
}: {
	params: Promise<{ driverId: string }>;
}) {
	const { driverId } = await params;

	return (
		<DriverProfilePage 
			driverId={driverId} 
		/>
	);
}

