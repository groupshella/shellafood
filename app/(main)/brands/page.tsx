import { Suspense } from "react";
import type { Metadata } from "next";
import { BrandsPageShell } from "@/features/brands/components/BrandsPageShell";
import { AllBrands } from "@/features/brands/components/sections/AllBrands";
import { getServerLocale } from "@/features/language/getServerLocale";

const MODULE_ID = "3";

export const metadata: Metadata = {
    title: "العلامات التجارية | شلة فود",
    description: "تصفح جميع العلامات التجارية.",
};

export default async function BrandsPage() {
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    return (
        <BrandsPageShell isArabic={isArabic}>
            <Suspense fallback={<AllBrands.skeleton />}>
                <AllBrands moduleId={MODULE_ID} isArabic={isArabic} />
            </Suspense>
        </BrandsPageShell>
    );
}
