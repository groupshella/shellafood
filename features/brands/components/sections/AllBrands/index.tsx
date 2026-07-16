import { getBrands } from "@/features/brands/api/brands";
import { AllBrandsClient } from "./AllBrandsClient";
import AllBrandsSkeleton from "./skeleton";

export const AllBrands = Object.assign(
    async function AllBrands({
        moduleId,
        isArabic,
    }: {
        moduleId: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const brands = await getBrands(moduleId, lang);
        if (brands.length === 0) return null;

        return <AllBrandsClient brands={brands} isArabic={isArabic} />;
    },
    { skeleton: AllBrandsSkeleton },
);
