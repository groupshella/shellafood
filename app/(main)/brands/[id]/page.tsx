import { Suspense } from "react";
import type { Metadata } from "next";
import { getBrands } from "@/features/brands/api/brands";
import { BrandPageShell } from "@/features/brands/components/BrandPageShell";
import { BrandItems } from "@/features/brands/components/sections/BrandItems";
import { AddToCart } from "@/features/cart/components/shared/AddToCart";
import { isArabicLocale } from "@/shared/lib/locale";

const MODULE_ID = "3";

interface BrandPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
    const { id } = await params;
    const isArabic = await isArabicLocale();
    const lang = isArabic ? "ar" : "en";
    const brands = await getBrands(MODULE_ID, lang).catch(() => []);
    const brand = brands.find((b) => String(b.id) === id);

    return {
        title: brand
            ? isArabic
                ? `${brand.name} | شلة فود`
                : `${brand.name} | Shella Food`
            : isArabic
              ? "براند | شلة فود"
              : "Brand | Shella Food",
    };
}

export default async function BrandPage({ params }: BrandPageProps) {
    const { id } = await params;
    const isArabic = await isArabicLocale();
    const lang = isArabic ? "ar" : "en";
    const brands = await getBrands(MODULE_ID, lang).catch(() => []);
    const brand = brands.find((b) => String(b.id) === id) ?? {
        id: Number(id),
        name: isArabic ? "براند" : "Brand",
        image_full_url: "",
    };

    return (
        <BrandPageShell brand={brand} isArabic={isArabic}>
            <Suspense fallback={<BrandItems.skeleton />}>
                <BrandItems brandId={id} isArabic={isArabic} />
            </Suspense>

            <AddToCart moduleId={MODULE_ID} />
        </BrandPageShell>
    );
}
