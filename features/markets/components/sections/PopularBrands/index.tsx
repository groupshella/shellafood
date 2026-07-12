import { getPopularBrands } from "@/features/markets/api/popular-brands";
import { PopularBrandsClient } from "./PopularBrandsClient";
import PopularBrandsSkeleton from "./skeleton";

export const PopularBrands = Object.assign(
    async function PopularBrands({ moduleId, isArabic }: { moduleId: string, isArabic: boolean }) {
        const brands = await getPopularBrands(moduleId, isArabic);
        if (brands.length === 0) return null;

        return <PopularBrandsClient brands={brands} isArabic={isArabic} />;
    },
    { skeleton: PopularBrandsSkeleton },
);
