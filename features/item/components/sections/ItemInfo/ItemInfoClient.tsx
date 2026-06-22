"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { PriceTag } from "@/features/home/components/shared/PriceTag";
import { ItemDetails } from "@/features/item/types/item.types";

interface ItemInfoClientProps {
    item: ItemDetails;
}

export function ItemInfoClient({ item }: ItemInfoClientProps) {
    const router = useRouter();
    const [imgError, setImgError] = useState(false);
    const discounted = item.discount > 0;
    const displayPrice = discounted ? item.price * (1 - item.discount / 100) : item.price;
    const inStock = item.is_available;

    return (
        <>
            <header className="flex items-center gap-3 bg-white px-4 pb-3 pt-4 sm:px-5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F0F0] transition-transform active:scale-90"
                    aria-label="رجوع"
                >
                    <ArrowRight className="h-4 w-4 text-gray-700" strokeWidth={2} />
                </button>
                <h1 className="flex-1 truncate text-center text-sm font-bold text-gray-900">{item.name}</h1>
                <div className="h-9 w-9" aria-hidden />
            </header>

            <div className="bg-white">
                <div className="relative aspect-square w-full overflow-hidden bg-[#F7F9F7]">
                    {!imgError && item.image_full_url ? (
                        <Image
                            src={item.image_full_url}
                            alt={item.name}
                            fill
                            className="object-contain p-6"
                            sizes="(max-width: 768px) 100vw, 480px"
                            priority
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center opacity-20">
                            <ShoppingBag className="h-16 w-16 text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-0.5 bg-white px-4 py-4 sm:px-5">
                <h2 className="text-base font-bold leading-snug text-gray-900">{item.name}</h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                        className={[
                            "rounded-lg px-2 py-1 text-xs font-semibold",
                            inStock ? "bg-[#E8F8E8] text-[#2F8F3B]" : "bg-red-50 text-red-600",
                        ].join(" ")}
                    >
                        {inStock ? "متوفر" : "غير متوفر"}
                    </span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                    {discounted && (
                        <PriceTag amount={item.price} size="sm" className="line-through" />
                    )}
                    <PriceTag amount={displayPrice} className="text-[#2F8F3B]" />
                    {discounted && (
                        <span className="mb-0.5 rounded-md bg-[#E53935] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            -{item.discount}%
                        </span>
                    )}
                </div>

                {item.description?.trim() && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <h3 className="mb-2 text-sm font-bold text-gray-900">الوصف</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                )}
            </div>
        </>
    );
}
