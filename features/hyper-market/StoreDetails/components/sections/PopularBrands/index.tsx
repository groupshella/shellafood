import { getHyperMarketPopularBrands } from "@/features/hyper-market/StoreDetails/api/popular-brands";
import { PopularBrandsClient } from "./PopularBrandsClient";
import PopularBrandsSkeleton from "./skeleton";

export const PopularBrands = Object.assign(
    async function PopularBrands({
        moduleId,
        isArabic,
    }: {
        moduleId: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const brands = await getHyperMarketPopularBrands(moduleId, lang);
        if (brands.length === 0) return null;

        return <PopularBrandsClient brands={brands} isArabic={isArabic} />;
    },
    { skeleton: PopularBrandsSkeleton },
);
