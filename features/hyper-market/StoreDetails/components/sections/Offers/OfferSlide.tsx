"use client";
import Image from "next/image";
import { HyperMarketOffer } from "@/features/hyper-market/StoreDetails/types/offers.types";
import { useRouter } from "next/navigation";

const SLIDE_CLASS = [
    "group relative w-full overflow-hidden rounded-2xl",
    "bg-gradient-to-br from-gray-100 to-gray-200",
    "shadow-sm ring-1 ring-black/[0.04]",
    "aspect-[16/9] sm:aspect-[21/8] md:aspect-[21/7] lg:aspect-[21/6]",
].join(" ");

export function OfferSlide({ offer, priority = false }: { offer: HyperMarketOffer; priority?: boolean }) {
    const router = useRouter();
    return (
        <div onClick={() => router.push(`/offers/${offer.id}?module_id=${offer.module_id}`)} className={SLIDE_CLASS}>
            <Image
                src={offer.banner}
                alt={offer.name || "عرض"}
                fill
                priority={priority}
                quality={85}
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px"
            />
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent"
                aria-hidden
            />
        </div>
    );
}