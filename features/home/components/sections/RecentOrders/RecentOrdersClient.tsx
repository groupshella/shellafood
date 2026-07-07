"use client";

import { RecentOrder } from "@/features/home/types/recent-orders.types";
import { OrderCard } from "./OrderCard";

export function RecentOrdersClient({ orders }: { orders: RecentOrder[] }) {
	return (
		<section aria-label="أعد طلبك" className="w-full min-w-0 space-y-2.5 sm:space-y-3 lg:space-y-4">
			<h2 className="text-right text-base font-bold text-gray-800 dark:text-gray-100 sm:text-lg md:text-xl">
				أعد طلبك
			</h2>
			<div className="flex flex-col gap-2 sm:gap-2.5 lg:gap-3">
				{orders.map((order) => (
					<OrderCard key={order.id} order={order} />
				))}
			</div>
		</section>
	);
}
