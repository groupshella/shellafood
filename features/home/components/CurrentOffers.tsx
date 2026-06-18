"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrentOffers } from "@/features/home/hooks/useCurrentOffers";
import { CurrentOffer } from "@/features/home/types/current-offers.types";

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
                        <svg
                            className="ms-0.5 inline-block"
                            width="18"
                            height="18"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ verticalAlign: "-2px" }}
                        >
                            <path
                                d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    {hasOriginalPrice && (
                        <span className="text-[13px] text-gray-400 line-through decoration-red-400 decoration-1">
                            {formatPrice(offer.original_price)}
                            <svg
                                className="ms-0.5 inline-block"
                                width="13"
                                height="13"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ verticalAlign: "-1px" }}
                            >
                                <path
                                    d="M16.0557 13.835C15.9558 14.6423 15.9119 14.9924 15.5391 15.7793L9.8125 16.9619C9.94413 16.1112 10.1191 15.4552 10.4043 15.0615L16.0557 13.835ZM8.0791 8.26465L9.79004 7.89355V2.4873C10.4276 1.7717 10.8195 1.4501 11.5889 1.04395V7.50391L16.0557 6.53418C15.9558 7.34162 15.9118 7.69164 15.5391 8.47852L11.5889 9.31348V11.1299L16.0557 10.1846C15.9558 10.9922 15.9121 11.3426 15.5391 12.1299L11.5889 12.9443V12.9619L9.79004 13.334V9.69336L8.0791 10.0547V12.3496L8.04883 12.3555C7.65527 13.0455 7.09989 13.8744 6.56445 14.5361L0.944336 15.6064C0.994737 14.8834 1.09981 14.4763 1.42676 13.748L6.2793 12.6953V10.4355L1.78125 11.3877C1.83165 10.6645 1.93761 10.2568 2.26465 9.52832L6.2793 8.65527V1.48145C6.91693 0.765707 7.30944 0.444342 8.0791 0.0380859V8.26465Z"
                                    fill="currentColor"
                                />
                            </svg>
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

export default function CurrentOffers() {
    const { offers, isLoading, error } = useCurrentOffers();

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
            <h2 className="text-lg font-bold text-gray-800">العروض الحالية</h2>
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
