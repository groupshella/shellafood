"use client";

import { CurrentOffer } from "@/features/markets/types/current-offers.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { CurrentOfferCard } from "./CurrentOfferCard";

export function CurrentOffersClient({ offers }: { offers: CurrentOffer[] }) {
    return (
        <section aria-label="العروض الحالية" className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <h2 className="text-lg font-bold text-gray-800">العروض الحالية</h2>
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
