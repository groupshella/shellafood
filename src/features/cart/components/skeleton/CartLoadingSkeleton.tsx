"use client";

import { CartItemSkeleton } from "./CartItemSkeleton";
import { OrderSummarySkeleton } from "./OrderSummarySkeleton";

export function CartLoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2 space-y-4">
				{[1, 2, 3].map((i) => (
					<CartItemSkeleton key={i} />
				))}
			</div>
			<div className="lg:col-span-1">
				<OrderSummarySkeleton />
			</div>
		</div>
	);
}

