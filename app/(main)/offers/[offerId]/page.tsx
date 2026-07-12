import { Suspense } from "react";
import type { Metadata } from "next";
import { OffersShell } from "@/features/offers/components/OffersShell";
import { OfferItems } from "@/features/offers/components/sections/OfferItems";
import { getOffers } from "@/features/offers/api/getOffers";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { getServerLocale } from "@/features/language/getServerLocale";

const MODULE_ID = "3";

interface OfferPageProps {
    params: Promise<{ offerId: string }>;
    searchParams: Promise<{ module_id?: string }>;
}

export async function generateMetadata({ params, searchParams }: OfferPageProps): Promise<Metadata> {
    const { offerId } = await params;
    const { module_id } = await searchParams;
    const moduleId = module_id ?? MODULE_ID;
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    const offers = await getOffers(moduleId, isArabic).catch(() => []);
    const offer = offers.find((o) => String(o.id) === offerId);

    return {
        title: offer
            ? `${offer.name} | ${isArabic ? "عروض وخصومات" : "Offers and discounts"} | شلة فود`
            : `${isArabic ? "عروض وخصومات" : "Offers and discounts"} | شلة فود`,
    };
}

export default async function OfferPage({ params, searchParams }: OfferPageProps) {
    const { offerId } = await params;
    const { module_id } = await searchParams;
    const moduleId = module_id ?? MODULE_ID;
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    const offers = await getOffers(moduleId, isArabic).catch(() => []);
    const offer = offers.find((o) => String(o.id) === offerId);

    return (
        <OffersShell offerName={offer?.name} isArabic={isArabic}>
            <Suspense fallback={<OfferItems.skeleton />}>
                <OfferItems offerId={offerId} moduleId={moduleId} isArabic={isArabic} />
            </Suspense>

            <AddToCart moduleId={moduleId} isArabic={isArabic} />
        </OffersShell>
    );
}
