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
        <div className="pointer-events-none fixed inset-x-0 z-50 flex justify-center bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-[#30913F] px-6 py-3 shadow-[0_8px_24px_rgba(48,145,63,0.35)] sm:gap-5 sm:px-7 sm:py-3.5">
                <Link
                    href="/cart"
                    aria-label={totalCount > 0 ? `السلة (${totalCount})` : "السلة"}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-11 sm:w-11"
                >
                    <ShoppingBag className="h-6 w-6 text-white" strokeWidth={2} />
                    {totalCount > 0 && (
                        <span className="absolute -top-0.5 end-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E53935] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#30913F]">
                            {totalCount > 99 ? "99+" : totalCount}
                        </span>
                    )}
                </Link>

                <div className="h-5 w-px bg-white/30" aria-hidden />

                <button
                    type="button"
                    onClick={() => router.push(searchHref)}
                    aria-label="بحث"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-11 sm:w-11"
                >
                    <Search className="h-6 w-6 text-white" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
