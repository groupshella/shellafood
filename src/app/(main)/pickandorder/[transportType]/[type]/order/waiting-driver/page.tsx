import { Metadata } from "next";
import { WaitingDriverPage } from "@/features/pick-and-order";

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
			? `في انتظار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `في انتظار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "في انتظار قبول السائق لطلب التوصيل بالدراجة النارية"
			: "في انتظار قبول السائق لطلب التوصيل بالشاحنة",
		keywords: [
			"في انتظار السائق",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `في انتظار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `في انتظار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "في انتظار قبول السائق لطلب التوصيل بالدراجة النارية"
				: "في انتظار قبول السائق لطلب التوصيل بالشاحنة",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/waiting-driver`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "في انتظار السائق - دراجة نارية" : "في انتظار السائق - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `في انتظار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `في انتظار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "في انتظار قبول السائق لطلب التوصيل بالدراجة النارية"
				: "في انتظار قبول السائق لطلب التوصيل بالشاحنة",
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/waiting-driver`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/waiting-driver`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/waiting-driver`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function WaitingDriverPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <WaitingDriverPage transportType={transportType} orderType={type} />;
}

