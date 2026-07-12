import { getServerLocale } from "@/features/language/getServerLocale";
import { GetPopularSearchResponse, PopularSearchItem } from "@/features/search/types/popular-search.types";

export async function getPopularSearch(moduleId: string): Promise<PopularSearchItem[]> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/search/popular?limit=10`, {
        headers: {
            Accept: "application/json",
            "Accept-Language": isArabic ? "ar" : "en",
            "X-Localization": isArabic ? "ar" : "en",
            moduleId,
        },
        next: {
            revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
            tags: ["popular-search", "search-data", `popular-search-${moduleId}`],
        },
    });

    if (!res.ok) throw new Error(`Failed to fetch popular search: ${res.status}`);

    const body = await res.json();
    const items: GetPopularSearchResponse = Array.isArray(body) ? body : (body.data ?? []);

    return items;
}
