import { Suspense } from "react";
import type { Metadata } from "next";
import { BrandsPageShell } from "@/features/hyper-market/Brands/components/BrandsPageShell";
import { AllBrands } from "@/features/hyper-market/Brands/components/sections/AllBrands";

const MODULE_ID = "3";

export const metadata: Metadata = {
    title: "العلامات التجارية | هايبر ماركت | شلة فود",
    description: "تصفح جميع العلامات التجارية في هايبر ماركت.",
};

export default function HyperMarketBrandsPage() {
    return (
        <BrandsPageShell>
            <Suspense fallback={<AllBrands.skeleton />}>
                <AllBrands moduleId={MODULE_ID} />
            </Suspense>
        </BrandsPageShell>
    );
}
