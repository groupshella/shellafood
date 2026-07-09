"use client";

import { CurrentOffer } from "@/features/home/types/current-offers.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OfferCard } from "./OfferCard";

export function CurrentOffersClient({ offers }: { offers: CurrentOffer[] }) {
	return (
		<section aria-label="العروض الحالية" className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4">
			<h2 className="text-start text-base font-bold text-gray-800 dark:text-gray-100 sm:text-lg md:text-xl">
				العروض الحالية
			</h2>
			<ScrollContainer
				className="-mx-3 px-3 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6 2xl:mx-0 2xl:px-0"
				ariaLabel="قائمة العروض الحالية"
			>
				{offers.map((offer, index) => (
					<OfferCard key={`${offer.store_id}-${offer.offer_title}-${index}`} offer={offer} index={index} />
				))}
			</ScrollContainer>
		</section>
	);
}
