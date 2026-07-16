"use client";

import { CurrentOffer } from "@/features/home/types/current-offers.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { OfferCard } from "./OfferCard";

export function CurrentOffersClient({
	offers,
	isArabic,
}: {
	offers: CurrentOffer[];
	isArabic: boolean;
}) {
	return (
		<section
			aria-label={isArabic ? "العروض الحالية" : "Current offers"}
			className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<h2 className="text-start text-base font-bold text-foreground sm:text-lg md:text-xl lg:text-2xl">
				{isArabic ? "العروض الحالية" : "Current offers"}
			</h2>
			<ScrollContainer
				className="-mx-3 px-3 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6 2xl:mx-0 2xl:px-0"
				ariaLabel={isArabic ? "قائمة العروض الحالية" : "Current offers list"}
			>
				{offers.map((offer, index) => (
					<OfferCard
						key={`${offer.store_id}-${offer.offer_title}-${index}`}
						offer={offer}
						index={index}
						isArabic={isArabic}
					/>
				))}
			</ScrollContainer>
		</section>
	);
}
