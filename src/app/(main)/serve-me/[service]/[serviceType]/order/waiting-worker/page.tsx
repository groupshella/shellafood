import { Metadata } from "next";
import { WaitingWorkerPage } from "@/features/serve-me";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}): Promise<Metadata> {
	const { service, serviceType } = await params;

	return {
		title: `في انتظار الفني - ${serviceType} | شلة فود`,
		description: "في انتظار قبول الفني لطلب الخدمة",
		keywords: [
			"في انتظار الفني",
			service,
			serviceType,
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `في انتظار الفني - ${serviceType} | شلة فود`,
			description: "في انتظار قبول الفني لطلب الخدمة",
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/order/waiting-worker`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: "في انتظار الفني",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `في انتظار الفني - ${serviceType} | شلة فود`,
			description: "في انتظار قبول الفني لطلب الخدمة",
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/order/waiting-worker`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/order/waiting-worker`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/order/waiting-worker`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function WaitingWorkerPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;

	return <WaitingWorkerPage service={service} serviceType={serviceType} />;
}

