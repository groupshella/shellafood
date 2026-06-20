"use client";

import { DiscountedStore } from "@/features/home/types/discounted-stores.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { StoreCard } from "./StoreCard";

export function DiscountedStoresClient({ stores }: { stores: DiscountedStore[] }) {
    return (
        <section aria-label="متاجر بخصومات" className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <h2 className="text-lg font-bold text-gray-800">متاجر بخصومات</h2>
            <ScrollContainer>
                {stores.map((store) => (
                    <div key={store.id} className="snap-start">
                        <StoreCard store={store} />
                    </div>
                ))}
            </ScrollContainer>
        </section>
    );
}
