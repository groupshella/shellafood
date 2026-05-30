import { Metadata } from "next";
import { TransportTypeHeroSection, TransportTypeFeaturesSection, InfoSection, AdditionalSection } from "@/features/pick-and-order";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "Motorbike Delivery | شلة فود - خدمة التوصيل السريع"
			: "Truck Delivery | شلة فود - خدمة التوصيل السريع",
		description: isMotorbike
			? "خدمة توصيل سريعة بالدراجة النارية. توصيل سريع وآمن مع تتبع مباشر للشحنة."
			: "خدمة توصيل بالشاحنة للشحنات الكبيرة. خدمة آمنة ومضمونة للمسافات الطويلة.",
		keywords: [
			"توصيل",
			"خدمة توصيل",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"delivery service",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? "Motorbike Delivery | شلة فود - خدمة التوصيل السريع"
				: "Truck Delivery | شلة فود - خدمة التوصيل السريع",
			description: isMotorbike
				? "خدمة توصيل سريعة بالدراجة النارية. توصيل سريع وآمن مع تتبع مباشر للشحنة."
				: "خدمة توصيل بالشاحنة للشحنات الكبيرة. خدمة آمنة ومضمونة للمسافات الطويلة.",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "Motorbike Delivery - شلة فود" : "Truck Delivery - شلة فود",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? "Motorbike Delivery | شلة فود - خدمة التوصيل السريع"
				: "Truck Delivery | شلة فود - خدمة التوصيل السريع",
			description: isMotorbike
				? "خدمة توصيل سريعة بالدراجة النارية. توصيل سريع وآمن مع تتبع مباشر للشحنة."
				: "خدمة توصيل بالشاحنة للشحنات الكبيرة. خدمة آمنة ومضمونة للمسافات الطويلة.",
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
			canonical: `https://shellafood.com/pickandorder/${transportType}`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function TransportTypePageRoute({
	params,
}: {
	params: Promise<{ transportType: string }>;
}) {
	const { transportType } = await params;

	return (
		<>
			<TransportTypeHeroSection transportType={transportType} />
			<TransportTypeFeaturesSection transportType={transportType} />
			<InfoSection transportType={transportType} />
			<AdditionalSection transportType={transportType} />
		</>
	);
}
