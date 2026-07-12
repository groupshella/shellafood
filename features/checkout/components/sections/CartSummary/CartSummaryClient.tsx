"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import type { CartItem } from "@/features/cart/types/cart.types";
import { useLanguage } from "@/features/language/useLanguage";

interface CartSummaryClientProps {
    items: CartItem[];
}

function getTotalQuantity(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function CartSummaryClient({ items }: CartSummaryClientProps) {
    const cartCount = getTotalQuantity(items);
    const { isArabic } = useLanguage();

    return (
        <div dir={isArabic ? "rtl" : "ltr"}>
            <p className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                {isArabic ? `يوجد ${cartCount.toLocaleString("en-US")} منتجات في سلتك` : `There are ${cartCount.toLocaleString("en-US")} products in your cart`}
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:gap-2.5 [&::-webkit-scrollbar]:hidden">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
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
                            <Package className="h-6 w-6 text-gray-400 dark:text-gray-500 sm:h-7 sm:w-7" strokeWidth={1.5} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
