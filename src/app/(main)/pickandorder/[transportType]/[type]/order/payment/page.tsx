import { Metadata } from "next";
import { OrderPaymentPage } from "@/features/pick-and-order";

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
			? `الدفع - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `الدفع - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "اختر طريقة الدفع لإتمام طلب التوصيل بالدراجة النارية"
			: "اختر طريقة الدفع لإتمام طلب التوصيل بالشاحنة",
		keywords: [
			"الدفع",
			"إتمام الدفع",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `الدفع - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `الدفع - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "اختر طريقة الدفع لإتمام طلب التوصيل بالدراجة النارية"
				: "اختر طريقة الدفع لإتمام طلب التوصيل بالشاحنة",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/payment`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "الدفع - دراجة نارية" : "الدفع - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `الدفع - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `الدفع - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "اختر طريقة الدفع لإتمام طلب التوصيل بالدراجة النارية"
				: "اختر طريقة الدفع لإتمام طلب التوصيل بالشاحنة",
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/payment`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/payment`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/payment`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function OrderPaymentPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <OrderPaymentPage transportType={transportType} orderType={type} />;
}

