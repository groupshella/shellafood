import { getBrandItems } from "@/features/brands/api/brand-items";
import { BrandItemsClient } from "./BrandItemsClient";
import BrandItemsSkeleton from "./skeleton";
import EmptyState from "./skeleton";

export const BrandItems = Object.assign(
    async function BrandItems({ brandId, isArabic }: { brandId: string, isArabic: boolean }) {
        const { items, total } = await getBrandItems(brandId);
        return <BrandItemsClient items={items} total={total} brandId={brandId} isArabic={isArabic} />;
    },
    { skeleton: BrandItemsSkeleton }
);
