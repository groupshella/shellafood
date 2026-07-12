import {
    GetHyperMarketPopularBrandsResponse,
    HyperMarketPopularBrand,
} from "@/features/hyper-market/StoreDetails/types/popular-brands.types";

export async function getHyperMarketPopularBrands(
    moduleId: string,
    isArabic: boolean
): Promise<HyperMarketPopularBrand[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/brands`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "X-Localization": isArabic ? "ar" : "en",
            moduleId,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["popular-brands", "hyper-market-data"],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch popular brands: ${res.status}`);

    const body = await res.json();
    const brands: GetHyperMarketPopularBrandsResponse = Array.isArray(body) ? body : (body.data ?? []);

    return brands;
}
