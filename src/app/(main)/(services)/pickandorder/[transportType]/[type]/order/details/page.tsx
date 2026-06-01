import { Metadata } from "next";
import { OrderDetailsPageMultiDirection } from "@/features/(services)/pick-and-order";

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
			? `تفاصيل الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `تفاصيل الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "أدخل تفاصيل طلب التوصيل بالدراجة النارية"
			: "أدخل تفاصيل طلب التوصيل بالشاحنة",
		keywords: [
			"تفاصيل الطلب",
			"حجز موعد",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `تفاصيل الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `تفاصيل الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "أدخل تفاصيل طلب التوصيل بالدراجة النارية"
				: "أدخل تفاصيل طلب التوصيل بالشاحنة",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/details`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "تفاصيل الطلب - دراجة نارية" : "تفاصيل الطلب - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `تفاصيل الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `تفاصيل الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "أدخل تفاصيل طلب التوصيل بالدراجة النارية"
				: "أدخل تفاصيل طلب التوصيل بالشاحنة",
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/details`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/details`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/details`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function OrderDetailsPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <OrderDetailsPageMultiDirection transportType={transportType} orderType={type} />;
}

