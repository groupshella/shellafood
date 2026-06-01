import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { IndividualServicePage } from "@/features/(services)/serve-me";
import { getIndividualService, isValidIndividualService, getAllIndividualServicePaths } from "@/lib/data/serve-me/services";

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
		title: `${service} | اخدمني - شلة فود`,
		description: `احصل على أفضل الخدمات من شلة فود.`,
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `${service} | اخدمني - شلة فود`,
			description: `احصل على أفضل الخدمات من شلة فود.`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: service,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${service} | اخدمني - شلة فود`,
			description: `احصل على أفضل الخدمات من شلة فود.`,
			images: ["/og-serve-me.jpg"],
			creator: "@shellafood",
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function IndividualServicePageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;

	return <IndividualServicePage serviceSlug={service} serviceTypeSlug={serviceType} />;
}

