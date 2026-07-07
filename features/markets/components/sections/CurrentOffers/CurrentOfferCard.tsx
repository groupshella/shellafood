import Image from "next/image";
import Link from "next/link";
import { CurrentOffer } from "@/features/markets/types/current-offers.types";
import { PriceTag } from "@/features/home/components/shared/PriceTag";

function OfferWavePattern({ patternId }: { patternId: string }) {
    return (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <defs>
                <pattern id={patternId} x="0" y="0" width="140" height="70" patternUnits="userSpaceOnUse">
                    <path d="M-20 28 C 10 8, 50 8, 80 28 S 150 48, 180 28" fill="none" stroke="white" strokeWidth="2.5" opacity="0.55" />
                    <path d="M-20 48 C 10 28, 50 28, 80 48 S 150 68, 180 48" fill="none" stroke="white" strokeWidth="2" opacity="0.35" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    );
}

export function CurrentOfferCard({ offer, index }: { offer: CurrentOffer; index: number }) {
    const patternId = `market-wave-${offer.store_id}-${index}`;
    const hasOriginalPrice = offer.original_price > offer.discounted_price;

    return (
        <Link
            href={`/stores/${offer.store_id}`}
            dir="rtl"
            className={[
                "group flex w-[9.75rem] shrink-0 flex-col overflow-hidden rounded-2xl bg-white sm:w-[11rem] lg:w-[11.5rem]",
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)] outline-none dark:bg-gray-800 dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]",
                "transition-transform duration-150 active:scale-[0.98]",
                "focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950",
            ].join(" ")}
            aria-label={`${offer.store_name} — ${offer.offer_title}`}
        >
            <div className="relative h-[8rem] w-full shrink-0 overflow-hidden bg-[#FFF5F0] dark:bg-orange-950/30 sm:h-[9.25rem] lg:h-[9.5rem]">
                <OfferWavePattern patternId={patternId} />
                <div className="relative flex h-full items-center justify-center px-3 py-4">
                    {offer.image_full_url ? (
                        <Image
                            src={offer.image_full_url}
                            alt={offer.offer_title}
                            width={140}
                            height={120}
                            className="max-h-[7rem] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:max-h-[7.75rem]"
                            sizes="(max-width: 640px) 156px, 184px"
                            priority={index < 3}
                            loading={index < 3 ? "eager" : "lazy"}
                        />
                    ) : (
                        <div className="h-[6.25rem] w-[6.25rem] rounded-2xl bg-white/40 dark:bg-white/10" />
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 bg-white px-2.5 pb-2.5 pt-2 dark:bg-gray-800 sm:gap-2 sm:px-3 sm:pb-3 sm:pt-2.5">
                <div className="flex items-center justify-start gap-2 sm:gap-2.5">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 sm:h-11 sm:w-11">
                        {offer.store_logo_full_url ? (
                            <Image
                                src={offer.store_logo_full_url}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 36px, 44px"
                                loading="lazy"
                            />
                        ) : (
                            <div className="h-full w-full bg-[#30913F]/15 dark:bg-[#30913F]/25" />
                        )}
                    </div>
                    <h3 className="line-clamp-1 min-w-0 flex-1 text-[13px] font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-[15px]">
                        {offer.store_name}
                    </h3>
                </div>

                <p className="line-clamp-1 text-xs leading-snug text-gray-500 dark:text-gray-400 sm:text-[13px]">
                    {offer.offer_title}
                </p>
                <div className="mt-auto flex flex-wrap items-baseline justify-start gap-1.5 pt-0.5 sm:gap-2">
                    <PriceTag amount={offer.discounted_price} />
                    {hasOriginalPrice && (
                        <PriceTag
                            amount={offer.original_price}
                            size="sm"
                            className="line-through decoration-red-400 decoration-1 dark:decoration-red-500"
                        />
                    )}
                </div>
            </div>
        </Link>
    );
}
