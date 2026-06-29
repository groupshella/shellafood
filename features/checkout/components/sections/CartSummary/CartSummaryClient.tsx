"use client";

import { Package } from "lucide-react";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";

interface CartSummaryClientProps {
    data: CheckoutData;
}

export function CartSummaryClient({ data }: CartSummaryClientProps) {
    return (
        <div dir="rtl">
            <p className="mb-3 text-[15px] font-bold text-gray-900">
                يوجد {data.cartCount} منتجات في سلتك
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
                {data.cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white"
                        aria-label={item.name}
                    >
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
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
