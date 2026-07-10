import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { HyperMarketPopularBrand } from "@/features/hyper-market/StoreDetails/types/popular-brands.types";

export const BrandCard = memo(function BrandCard({ brand }: { brand: HyperMarketPopularBrand }) {
    const name = brand.name?.trim() || "";

    return (
        <Link
            href={`/brands/${brand.id}`}
            className={[
                "flex min-h-[68px] items-center gap-2.5 rounded-2xl bg-white p-2.5 sm:min-h-[76px] sm:gap-3 sm:p-3",
                "ring-1 ring-black/[0.06] dark:bg-gray-800 dark:ring-white/[0.08]",
                "transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/80",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
            ].join(" ")}
            aria-label={name}
        >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-50 ring-1 ring-black/[0.04] dark:bg-gray-700 dark:ring-white/[0.06] sm:h-14 sm:w-14">
                {brand.image_full_url ? (
                    <Image
                        src={brand.image_full_url}
                        alt=""
                        fill
                        className="object-contain p-1.5"
                        sizes="56px"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400 dark:bg-gray-600 dark:text-gray-300">
                        {name.charAt(0)}
                    </div>
                )}
            </div>

            <h3 className="line-clamp-2 min-w-0 flex-1 text-start text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-[15px]">
                {name}
            </h3>
        </Link>
    );
});
