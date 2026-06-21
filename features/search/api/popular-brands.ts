import { GetPopularBrandsResponse, PopularBrand } from "@/features/search/types/popular-brands.types";

export async function getPopularBrands(moduleId: string): Promise<PopularBrand[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/brands`, {
        headers: {
            Accept: "application/json",
            "X-Localization": "ar",
            moduleId,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["popular-brands", "search-data"],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch popular brands: ${res.status}`);

    const body = await res.json();
    const brands: GetPopularBrandsResponse = Array.isArray(body) ? body : (body.data ?? []);

    return brands;
}
