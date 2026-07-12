import { getServerLocale } from "@/features/language/getServerLocale";
import { GetPopularBrandsResponse, PopularBrand } from "@/features/search/types/popular-brands.types";

export async function getPopularBrands(moduleId: string): Promise<PopularBrand[]> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/brands`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": isArabic ? "ar" : "en",
            "X-Localization": isArabic ? "ar" : "en",
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
