import { Brand, GetBrandsResponse } from "@/features/brands/types/brands.types";

export async function getBrands(moduleId: string): Promise<Brand[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/brands`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Localization": "ar",
            moduleId,
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["brands", "hyper-market-data", `module-${moduleId}-brands`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch brands: ${res.status}`);

    const body = await res.json();
    const brands: GetBrandsResponse = Array.isArray(body) ? body : (body.data ?? []);

    return brands;
}
