import { Metadata } from "next";
import { BookingSummaryPage } from "@/features/serve-me";
import { getAllIndividualServicePaths } from "@/lib/data/services";

export async function generateStaticParams() {
	const paths = getAllIndividualServicePaths();
	return paths.map(({ category, service }) => ({
		service: category,
		serviceType: service,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}): Promise<Metadata> {
	const { service, serviceType } = await params;

	return {
		title: `ملخص الحجز - ${service} | اخدمني - شلة فود`,
		description: `راجع ملخص حجزك لخدمة ${service}. تحقق من تفاصيل الخدمة والأسعار والعنوان قبل المتابعة إلى الدفع.`,
		keywords: [
			service,
			"ملخص الحجز",
			"ملخص الطلب",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `ملخص الحجز - ${service} | اخدمني - شلة فود`,
			description: `راجع ملخص حجزك لخدمة ${service}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: `ملخص الحجز - ${service}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `ملخص الحجز - ${service} | اخدمني - شلة فود`,
			description: `راجع ملخص حجزك لخدمة ${service}`,
			images: ["/og-serve-me.jpg"],
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function BookingSummaryPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;
	return <BookingSummaryPage service={service} serviceType={serviceType} />;
}
