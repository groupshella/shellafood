"use client";

import { DiscountedStore } from "@/features/home/types/discounted-stores.types";
import { ScrollContainer } from "@/features/home/components/shared/ScrollContainer";
import { StoreCard } from "./StoreCard";

export function DiscountedStoresClient({ stores }: { stores: DiscountedStore[] }) {
	return (
		<section aria-label="متاجر بخصومات" className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4">
			<h2 className="text-start text-base font-bold text-gray-800 dark:text-gray-100 sm:text-lg md:text-xl">
				متاجر بخصومات
			</h2>
			<ScrollContainer
				className="-mx-3 px-3 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6 2xl:mx-0 2xl:px-0"
				ariaLabel="قائمة المتاجر بخصومات"
			>
				{stores.map((store) => (
					<StoreCard key={store.id} store={store} />
				))}
			</ScrollContainer>
		</section>
	);
}
