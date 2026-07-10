import { getBrands } from "@/features/brands/api/brands";
import { AllBrandsClient } from "./AllBrandsClient";
import AllBrandsSkeleton from "./skeleton";

export const AllBrands = Object.assign(
    async function AllBrands({ moduleId }: { moduleId: string }) {
        const brands = await getBrands(moduleId);
        if (brands.length === 0) return null;

        return <AllBrandsClient brands={brands} />;
    },
    { skeleton: AllBrandsSkeleton },
);
