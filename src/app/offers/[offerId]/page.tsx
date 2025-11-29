import React from "react";
import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import { OfferDetailsClient } from "@/components/Offers";
import offerService from "@/services/offer.service";

// Metadata for SEO
export async function generateMetadata({
	params,
}: {
	params: Promise<{ offerId: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const offerId = parseInt(resolvedParams.offerId);
	const offer = await offerService.getOfferById(offerId);

	if (!offer) {
		return {
			title: "Offer Not Found - Shella Food",
			description: "The requested offer could not be found",
		};
	}

	return {
		title: `${offer.titleEn} - Special Offer | Shella Food`,
		description: offer.descriptionEn,
		openGraph: {
			title: offer.titleEn,
			description: offer.descriptionEn,
			images: [
				{
					url: offer.image,
					width: 1200,
					height: 630,
					alt: offer.titleEn,
				},
			],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: offer.titleEn,
			description: offer.descriptionEn,
			images: [offer.image],
		},
	};
}

interface OfferDetailsPageProps {
	params: Promise<{ offerId: string }>;
	searchParams: Promise<{ type?: string; transport?: string }>;
}

// Server Component
export default async function OfferDetailsPage({
	params,
	searchParams,
}: OfferDetailsPageProps) {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
			<NavBarCondition />
			<OfferDetailsClient params={params} searchParams={searchParams} />
			<ShellaFooter />
		</div>
	);
}
