"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrentOffers } from "@/features/module/hooks/useCurrentOffers";
import { CurrentOffer } from "@/features/module/types/current-offers.types";

function formatPrice(price: number): string {
    return price.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function OfferWavePattern({ patternId }: { patternId: string }) {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
        >
            <defs>
                <pattern
                    id={patternId}
                    x="0"
                    y="0"
                    width="140"
                    height="70"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M-20 28 C 10 8, 50 8, 80 28 S 150 48, 180 28"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        opacity="0.55"
                    />
                    <path
                        d="M-20 48 C 10 28, 50 28, 80 48 S 150 68, 180 48"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        opacity="0.35"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    );
}

function OfferCard({ offer }: { offer: CurrentOffer }) {
    const wavePatternId = useId();
    const [imageError, setImageError] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const hasOriginalPrice = offer.original_price > offer.discounted_price;

    return (
        <Link
            href={`/store/${offer.store_id}`}
            dir="rtl"
            className={[
                "group flex w-[172px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white",
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)] outline-none",
                "transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label={`${offer.store_name} — ${offer.offer_title}`}
        >
            <div className="relative h-[148px] w-full shrink-0 overflow-hidden bg-[#FFF5F0]">
                <OfferWavePattern patternId={wavePatternId} />
                <div className="relative flex h-full items-center justify-center px-3 py-4">
                    {!imageError && offer.image_full_url ? (
                        <Image
                            src={offer.image_full_url}
                            alt={offer.offer_title}
                            width={140}
                            height={120}
                            className="max-h-[120px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                            sizes="172px"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="h-[100px] w-[100px] rounded-2xl bg-white/40" />
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 bg-white px-3 pb-3 pt-2.5">
                <div className="flex items-center justify-start gap-2.5">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {!logoError && offer.store_logo_full_url ? (
                            <Image
                                src={offer.store_logo_full_url}
                                alt={offer.store_name}
                                fill
                                className="object-cover"
                                sizes="44px"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <div className="h-full w-full bg-[#30913F]/15" />
                        )}
                    </div>
                    <h3 className="line-clamp-1 min-w-0 flex-1 text-[15px] font-bold leading-snug text-gray-900">
                        {offer.store_name}
                    </h3>
                </div>

                <p className="line-clamp-1 text-[13px] leading-snug text-gray-500">
                    {offer.offer_title}
                </p>

                <div className="mt-auto flex items-baseline justify-start gap-2 pt-0.5">
                    <span className="text-[22px] font-bold leading-none tracking-tight text-gray-900">
                        {formatPrice(offer.discounted_price)}
                        <span className="ms-0.5 text-[18px] font-bold">﷼</span>
                    </span>
                    {hasOriginalPrice && (
                        <span className="text-[13px] text-gray-400 line-through decoration-red-400 decoration-1">
                            {formatPrice(offer.original_price)} ﷼
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

function CurrentOffersSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-7 w-36 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[268px] w-[172px] shrink-0 animate-pulse rounded-2xl bg-gray-100"
                    />
                ))}
            </div>
        </div>
    );
}

export default function CurrentOffers({ moduleId, moduleName }: { moduleId: string; moduleName: string }) {
    const { offers, isLoading, error } = useCurrentOffers(moduleId);

    if (isLoading) return <CurrentOffersSkeleton />;
    if (error || offers.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            aria-label="العروض الحالية"
            className="mx-auto w-full max-w-5xl space-y-3 px-4"
        >
            <h2 className="text-lg font-bold text-gray-800">
                العروض الحالية
            </h2>
            <div
                className={[
                    "flex gap-3 overflow-x-auto pb-1",
                    "snap-x snap-mandatory scroll-smooth",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
            >
                {offers.map((offer, index) => (
                    <div
                        key={`${offer.store_id}-${offer.offer_title}-${index}`}
                        className="snap-start"
                    >
                        <OfferCard offer={offer} />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
