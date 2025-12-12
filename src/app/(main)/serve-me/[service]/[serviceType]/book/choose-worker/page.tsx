import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ChooseWorker } from "@/features/serve-me";
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
		title: `اختيار الفني - ${service} | اخدمني - شلة فود`,
		description: `اختر الفني المناسب لخدمة ${service} من شلة فود.`,
		keywords: [
			service,
			"اختيار الفني",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `اختيار الفني - ${service} | اخدمني - شلة فود`,
			description: `اختر الفني المناسب لخدمة ${service}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/choose-worker`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-serve-me.jpg",
					width: 1200,
					height: 630,
					alt: `اختيار الفني - ${service}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `اختيار الفني - ${service} | اخدمني - شلة فود`,
			description: `اختر الفني المناسب لخدمة ${service}`,
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/choose-worker`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/choose-worker`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/choose-worker`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ChooseWorkerBookingPageRoute({
	params,
}: {
	params: Promise<{ service: string; serviceType: string }>;
}) {
	const { service, serviceType } = await params;

	return (
		<ChooseWorker
			serviceSlug={service}
			serviceTypeSlug={serviceType}
		/>
	);
}

