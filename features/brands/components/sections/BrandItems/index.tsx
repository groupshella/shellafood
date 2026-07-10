import { getBrandItems } from "@/features/brands/api/brand-items";
import { BrandItemsClient } from "./BrandItemsClient";
import BrandItemsSkeleton from "./skeleton";
import EmptyState from "./skeleton";

export const BrandItems = Object.assign(
    async function BrandItems({ brandId }: { brandId: string }) {
        const { items, total } = await getBrandItems(brandId);
        return <BrandItemsClient items={items} total={total} brandId={brandId} />;
    },
    { skeleton: BrandItemsSkeleton }
);
