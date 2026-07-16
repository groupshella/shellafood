import { Suspense } from "react";
import type { Metadata } from "next";
import { BrandsPageShell } from "@/features/brands/components/BrandsPageShell";
import { AllBrands } from "@/features/brands/components/sections/AllBrands";
import { isArabicLocale } from "@/shared/lib/locale";

const MODULE_ID = "3";

export async function generateMetadata(): Promise<Metadata> {
    const isArabic = await isArabicLocale();
    return {
        title: isArabic
            ? "العلامات التجارية | شلة فود"
            : "Brands | Shella Food",
        description: isArabic
            ? "تصفح جميع العلامات التجارية."
            : "Browse all brands.",
    };
}

export default async function BrandsPage() {
    const isArabic = await isArabicLocale();

    return (
        <BrandsPageShell isArabic={isArabic}>
            <Suspense fallback={<AllBrands.skeleton />}>
                <AllBrands moduleId={MODULE_ID} isArabic={isArabic} />
            </Suspense>
        </BrandsPageShell>
    );
}
