import { Metadata } from "next";
import { AcceptedWorkersPage } from "@/features/serve-me";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}): Promise<Metadata> {
	const { service, serviceType } = await params;

	return {
		title: `الفنيون المقبولون - ${serviceType} | شلة فود`,
		description: "اختر الفني المناسب من الفنيين المقبولين",
		keywords: [
			"الفنيون المقبولون",
			service,
			serviceType,
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `الفنيون المقبولون - ${serviceType} | شلة فود`,
			description: "اختر الفني المناسب من الفنيين المقبولين",
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/order/accepted-workers`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: "الفنيون المقبولون",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `الفنيون المقبولون - ${serviceType} | شلة فود`,
			description: "اختر الفني المناسب من الفنيين المقبولين",
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/order/accepted-workers`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/order/accepted-workers`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/order/accepted-workers`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function AcceptedWorkersPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;

	return <AcceptedWorkersPage service={service} serviceType={serviceType} />;
}

