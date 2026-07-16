import { getBrandItems } from "@/features/brands/api/brand-items";
import { BrandItemsClient } from "./BrandItemsClient";
import BrandItemsSkeleton from "./skeleton";

export const BrandItems = Object.assign(
    async function BrandItems({
        brandId,
        isArabic,
    }: {
        brandId: string;
        isArabic: boolean;
    }) {
        const lang = isArabic ? "ar" : "en";
        const { items, total } = await getBrandItems(brandId, lang);
        return (
            <BrandItemsClient
                items={items}
                total={total}
                brandId={brandId}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: BrandItemsSkeleton }
);
