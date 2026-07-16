import { Suspense } from "react";
import type { Metadata } from "next";
import { OffersShell } from "@/features/offers/components/OffersShell";
import { OfferItems } from "@/features/offers/components/sections/OfferItems";
import { getOffers } from "@/features/offers/api/getOffers";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { isArabicLocale } from "@/shared/lib/locale";

const MODULE_ID = "3";

interface OfferPageProps {
    params: Promise<{ offerId: string }>;
    searchParams: Promise<{ module_id?: string }>;
}

export async function generateMetadata({ params, searchParams }: OfferPageProps): Promise<Metadata> {
    const { offerId } = await params;
    const { module_id } = await searchParams;
    const moduleId = module_id ?? MODULE_ID;
    const isArabic = await isArabicLocale();
    const lang = isArabic ? "ar" : "en";
    const offers = await getOffers(moduleId, lang).catch(() => []);
    const offer = offers.find((o) => String(o.id) === offerId);

    return {
        title: offer
            ? isArabic
                ? `${offer.name} | عروض وخصومات | شلة فود`
                : `${offer.name} | Offers & discounts | Shella Food`
            : isArabic
              ? "عروض وخصومات | شلة فود"
              : "Offers & discounts | Shella Food",
    };
}

export default async function OfferPage({ params, searchParams }: OfferPageProps) {
    const { offerId } = await params;
    const { module_id } = await searchParams;
    const moduleId = module_id ?? MODULE_ID;
    const isArabic = await isArabicLocale();
    const lang = isArabic ? "ar" : "en";

    const offers = await getOffers(moduleId, lang).catch(() => []);
    const offer = offers.find((o) => String(o.id) === offerId);

    return (
        <OffersShell offerName={offer?.name} isArabic={isArabic}>
            <Suspense fallback={<OfferItems.skeleton />}>
                <OfferItems offerId={offerId} moduleId={moduleId} isArabic={isArabic} />
            </Suspense>

            <AddToCart moduleId={moduleId} />
        </OffersShell>
    );
}
