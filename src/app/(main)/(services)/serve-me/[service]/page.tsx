import { Metadata } from "next";
import { getAllServiceCategorySlugs } from "@/lib/data/serve-me/services";
import { ServiceCategoryPage } from "@/features/(services)/serve-me";

export async function generateStaticParams() {
	const serviceSlugs = getAllServiceCategorySlugs();
	return serviceSlugs.map((service) => ({
		service,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ service: string }>;
}): Promise<Metadata> {
	const { service } = await params;

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
			url: `https://shellafood.com/serve-me/${service}`,
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
			canonical: `https://shellafood.com/serve-me/${service}`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}`,
				"en-US": `https://shellafood.com/serve-me/${service}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ServiceCategoryPageRoute({
	params,
}: {
	params: Promise<{ service: string }>;
}) {
	const { service } = await params;

	return <ServiceCategoryPage serviceSlug={service} />;
}

