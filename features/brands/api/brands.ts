import { Brand, GetBrandsResponse } from "@/features/brands/types/brands.types";

export async function getBrands(
    moduleId: string,
    lang: "ar" | "en"
): Promise<Brand[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/brands`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Accept-Language": lang,
            "X-Localization": lang,
            lang,
            moduleId,
            zoneId: process.env.ZONE_ID!,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["brands", "hyper-market-data", `module-${moduleId}-brands`, `module-${moduleId}-brands-${lang}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch brands: ${res.status}`);

    const body = await res.json();
    const brands: GetBrandsResponse = Array.isArray(body) ? body : (body.data ?? []);

    return brands;
}
