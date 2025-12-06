import { Metadata } from "next";
import { OrderSummaryPage } from "@/features/pick-and-order";

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
			? `ملخص الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `ملخص الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "راجع ملخص طلب التوصيل بالدراجة النارية قبل المتابعة إلى الدفع"
			: "راجع ملخص طلب التوصيل بالشاحنة قبل المتابعة إلى الدفع",
		keywords: [
			"ملخص الطلب",
			"مراجعة الطلب",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: isMotorbike
				? `ملخص الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `ملخص الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "راجع ملخص طلب التوصيل بالدراجة النارية قبل المتابعة إلى الدفع"
				: "راجع ملخص طلب التوصيل بالشاحنة قبل المتابعة إلى الدفع",
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/${type}/order/summary`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: isMotorbike ? "ملخص الطلب - دراجة نارية" : "ملخص الطلب - شاحنة",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: isMotorbike
				? `ملخص الطلب - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
				: `ملخص الطلب - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
			description: isMotorbike
				? "راجع ملخص طلب التوصيل بالدراجة النارية"
				: "راجع ملخص طلب التوصيل بالشاحنة",
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/${type}/order/summary`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/${type}/order/summary`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/${type}/order/summary`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function OrderSummaryPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; type: string }>;
}) {
	const { transportType, type } = await params;

	return <OrderSummaryPage transportType={transportType} orderType={type} />;
}

