"use client";

import { CurrentOffer } from "@/features/markets/types/current-offers.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { CurrentOfferCard } from "./CurrentOfferCard";

export function CurrentOffersClient({ offers }: { offers: CurrentOffer[] }) {
    return (
        <section
            aria-label="العروض الحالية"
            className="mx-auto w-full max-w-lg space-y-3 px-3 sm:max-w-2xl sm:px-5 lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl"
        >
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 sm:text-lg">العروض الحالية</h2>
            <ScrollContainer>
                {offers.map((offer, index) => (
                    <div key={`${offer.store_id}-${offer.offer_title}-${index}`} className="snap-start">
                        <CurrentOfferCard offer={offer} index={index} />
                    </div>
                ))}
            </ScrollContainer>
        </section>
    );
}
