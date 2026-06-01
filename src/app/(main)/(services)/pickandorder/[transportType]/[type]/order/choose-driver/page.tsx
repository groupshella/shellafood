import { Metadata } from "next";
import { ChooseDriverPage } from "@/features/(services)/pick-and-order";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}): Promise<Metadata> {
	const { transportType, type } = await params;
	const isMotorbike = transportType === "motorbike";
	const isMultiDirection = type === "multi-direction";

	return {
		title: isMotorbike
			? `اختيار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `اختيار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "اختر السائق الأنسب لتوصيل طلبك بالدراجة النارية"
			: "اختر السائق الأنسب لتوصيل طلبك بالشاحنة",
		keywords: [
			"اختيار السائق",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `اختيار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `اختيار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "اختر السائق الأنسب لتوصيل طلبك بالدراجة النارية"
				: "اختر السائق الأنسب لتوصيل طلبك بالشاحنة",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/choose-driver`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "اختيار السائق - دراجة نارية" : "اختيار السائق - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `اختيار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `اختيار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "اختر السائق الأنسب لتوصيل طلبك بالدراجة النارية"
				: "اختر السائق الأنسب لتوصيل طلبك بالشاحنة",
			images: ["/og-pickandorder.jpg"],
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/choose-driver`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/choose-driver`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/choose-driver`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ChooseDriverPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <ChooseDriverPage transportType={transportType} orderType={type} />;
}

