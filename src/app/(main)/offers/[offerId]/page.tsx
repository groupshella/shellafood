import { Metadata } from "next";
import { OfferDetailsClient } from "@/features/offers";

export async function generateMetadata({ params }: { params: Promise<{ offerId: string }> }): Promise<Metadata> {
	const { offerId } = await params;
	


	return {
		title: `عرض خاص | شلة فود`,
		description: "اكتشف هذا العرض الحصري من شلة فود",
		keywords: [
			"عرض خاص",
			"خصم",
			"عروض",
			"شلة فود",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `عرض خاص | شلة فود`,
			description: "اكتشف هذا العرض الحصري من شلة فود",
			type: "website",
			url: `https://shellafood.com/offers/${offerId}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
			images: [
				{
					url: "/og-offer.jpg",
					width: 1200,
					height: 630,
					alt: "عرض خاص | شلة فود",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `عرض خاص | شلة فود`,
			description: "اكتشف هذا العرض الحصري من شلة فود",
			images: ["/og-offer.jpg"],
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
			canonical: `https://shellafood.com/offers/${offerId}`,
			languages: {
				"ar-SA": `https://shellafood.com/offers/${offerId}`,
				"en-US": `https://shellafood.com/offers/${offerId}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}



export default async function OfferDetailsPageRoute({
	params,
}: {
	params: Promise<{ offerId: string }>;
}) {
	return <OfferDetailsClient params={params} />;
}
