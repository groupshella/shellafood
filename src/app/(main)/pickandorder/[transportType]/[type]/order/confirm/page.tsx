import { Metadata } from "next";
import { OrderConfirmationPage } from "@/features/pick-and-order";

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
			? `تأكيد الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `تأكيد الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "تم تأكيد طلب التوصيل بالدراجة النارية بنجاح"
			: "تم تأكيد طلب التوصيل بالشاحنة بنجاح",
		keywords: [
			"تأكيد الطلب",
			"تم الحجز",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `تأكيد الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `تأكيد الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "تم تأكيد طلب التوصيل بالدراجة النارية بنجاح"
				: "تم تأكيد طلب التوصيل بالشاحنة بنجاح",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/confirm`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "تأكيد الطلب - دراجة نارية" : "تأكيد الطلب - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `تأكيد الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `تأكيد الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "تم تأكيد طلب التوصيل بالدراجة النارية بنجاح"
				: "تم تأكيد طلب التوصيل بالشاحنة بنجاح",
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/confirm`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/confirm`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/confirm`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function OrderConfirmPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <OrderConfirmationPage transportType={transportType} orderType={type} />;
}

