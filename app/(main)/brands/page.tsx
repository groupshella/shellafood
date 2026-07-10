import { Suspense } from "react";
import type { Metadata } from "next";
import { BrandsPageShell } from "@/features/brands/components/BrandsPageShell";
import { AllBrands } from "@/features/brands/components/sections/AllBrands";

const MODULE_ID = "3";

export const metadata: Metadata = {
    title: "العلامات التجارية | شلة فود",
    description: "تصفح جميع العلامات التجارية.",
};

export default function BrandsPage() {
    return (
        <BrandsPageShell>
            <Suspense fallback={<AllBrands.skeleton />}>
                <AllBrands moduleId={MODULE_ID} />
            </Suspense>
        </BrandsPageShell>
    );
}
