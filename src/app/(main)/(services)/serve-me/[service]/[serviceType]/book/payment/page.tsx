import { Metadata } from "next";
import { PaymentPage } from "@/features/(services)/serve-me";
import { getAllIndividualServicePaths } from "@/lib/data/serve-me/services";

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
		title: `الدفع - ${service} | اخدمني - شلة فود`,
		description: `أكمل عملية الدفع لحجزك لخدمة ${service}. اختر من طرق الدفع الآمنة بما في ذلك البطاقات، Apple Pay، أو الدفع عند الاستلام.`,
		keywords: [
			service,
			"الدفع",
			"إتمام الدفع",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `الدفع - ${service} | اخدمني - شلة فود`,
			description: `أكمل عملية الدفع لحجزك لخدمة ${service}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/payment`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: `الدفع - ${service}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `الدفع - ${service} | اخدمني - شلة فود`,
			description: `أكمل عملية الدفع بأمان لحجزك لخدمة ${service}`,
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/payment`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/payment`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/payment`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function PaymentPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;
	return <PaymentPage service={service} serviceType={serviceType} />;
}
