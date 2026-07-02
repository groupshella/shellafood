"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import type { CartItem } from "@/features/cart/types/cart.types";

interface CartSummaryClientProps {
    items: CartItem[];
}

function getTotalQuantity(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function CartSummaryClient({ items }: CartSummaryClientProps) {
    const cartCount = getTotalQuantity(items);

    return (
        <div dir="rtl">
            <p className="mb-3 text-[15px] font-bold text-gray-900">
                يوجد {cartCount.toLocaleString("en-US")} منتجات في سلتك
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white"
                        aria-label={item.name}
                    >
                        {item.image_full_url ? (
                            <Image
                                src={item.image_full_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                                sizes="52px"
                            />
                        ) : (
                            <Package className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}