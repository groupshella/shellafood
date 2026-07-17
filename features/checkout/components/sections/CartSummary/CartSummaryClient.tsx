"use client";

import Image from "@/shared/components/SecureImage";
import { Package } from "lucide-react";
import type { CartItem } from "@/features/cart/types/cart.types";

interface CartSummaryClientProps {
	items: CartItem[];
	isArabic: boolean;
}

function getTotalQuantity(items: CartItem[]) {
	return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function CartSummaryClient({ items, isArabic }: CartSummaryClientProps) {
	const cartCount = getTotalQuantity(items);

	return (
		<div dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"}>
			<p className="mb-3 text-sm font-bold text-foreground sm:text-[15px]">
				{isArabic
					? `يوجد ${cartCount.toLocaleString("en-US")} منتجات في سلتك`
					: `You have ${cartCount.toLocaleString("en-US")} products in your cart`}
			</p>

			<div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:gap-2.5 [&::-webkit-scrollbar]:hidden">
				{items.map((item) => (
					<div
						key={item.id}
						className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
						title={item.name}
					>
						{item.image_full_url ? (
							<Image
								src={item.image_full_url}
								alt={item.name}
								fill
								className="object-contain p-1.5"
								sizes="(max-width: 640px) 56px, 72px"
							/>
						) : (
							<Package
								className="h-6 w-6 text-muted sm:h-7 sm:w-7"
								strokeWidth={1.5}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
