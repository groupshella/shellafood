import { Metadata } from "next";
import OrderDetailsPageMultiDirection from "@/features/pick-and-order/components/Order/OrderDetailsPageMultiDirection";

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ transportType: string; }>,
	searchParams: Promise<{ title: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const title = decodeURIComponent((await searchParams).title || "");

	return {
		title: `تفاصيل الطلب - ${title} | شلة خدمات`,
		description: `أدخل تفاصيل طلب التوصيل - ${title}`,
		keywords: [
			"تفاصيل الطلب",
			"حجز موعد",
			transportType,
			title,
			"شلة خدمات",
		],
		authors: [{ name: "شلة خدمات" }],
		creator: "شلة خدمات",
		publisher: "شلة خدمات",
		openGraph: {
			title: `تفاصيل الطلب - ${title} | شلة خدمات`,
			description: `أدخل تفاصيل طلب التوصيل - ${title}`,
			type: "website",
			url: `https://shellafood.com/pickandorder/${transportType}/order/details?title=${title}`,
			siteName: "شلة خدمات",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-pickandorder.jpg",
					width: 1200,
					height: 630,
					alt: `تفاصيل الطلب - ${title}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `تفاصيل الطلب - ${title} | شلة خدمات`,
			description: `أدخل تفاصيل طلب التوصيل - ${title}`,
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
			canonical: `https://shellafood.com/pickandorder/${transportType}/order/details?title=${title}`,
			languages: {
				"ar-SA": `https://shellafood.com/pickandorder/${transportType}/order/details?title=${title}`,
				"en-US": `https://shellafood.com/pickandorder/${transportType}/order/details?title=${title}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function OrderDetailsPageRoute({
	params,
}: {
	params: Promise<{ transportType: string; }>,
}) {
	const { transportType } = await params;

	return <OrderDetailsPageMultiDirection transportType={transportType} />;
}

