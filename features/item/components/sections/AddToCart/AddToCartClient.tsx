"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";

interface AddToCartClientProps {
    moduleId?: string;
}

export function AddToCartClient({ moduleId }: AddToCartClientProps) {
    const router = useRouter();
    const { totalCount } = useCart();
    const searchHref = moduleId ? `/search?module_id=${moduleId}` : "/search";

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
            <div className="pointer-events-auto flex items-center gap-5 rounded-full bg-[#30913F] px-7 py-3.5 shadow-[0_8px_24px_rgba(48,145,63,0.35)]">
                <Link
                    href="/cart"
                    aria-label={totalCount > 0 ? `السلة (${totalCount})` : "السلة"}
                    className="relative flex items-center justify-center transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
                >
                    <ShoppingBag className="h-6 w-6 text-white" strokeWidth={2} />
                    {totalCount > 0 && (
                        <span className="absolute -top-1.5 -end-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E53935] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#30913F]">
                            {totalCount > 99 ? "99+" : totalCount}
                        </span>
                    )}
                </Link>

                <div className="h-5 w-px bg-white/30" aria-hidden />

                <button
                    type="button"
                    onClick={() => router.push(searchHref)}
                    aria-label="بحث"
                    className="flex items-center justify-center transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
                >
                    <Search className="h-6 w-6 text-white" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
