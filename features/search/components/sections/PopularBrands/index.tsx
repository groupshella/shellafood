import { getPopularBrands } from "@/features/search/api/popular-brands";
import { PopularBrandsClient } from "./PopularBrandsClient";
import PopularBrandsSkeleton from "./skeleton";

export const PopularBrands = Object.assign(
    async function PopularBrands({
        moduleId,
        isArabic,
    }: {
        moduleId?: string;
        isArabic: boolean;
    }) {
        if (!moduleId || Number.isNaN(Number(moduleId))) return null;

        const brands = await getPopularBrands(moduleId, isArabic ? "ar" : "en");
        if (brands.length === 0) return null;

        return <PopularBrandsClient brands={brands} isArabic={isArabic} />;
    },
    { skeleton: PopularBrandsSkeleton }
);
