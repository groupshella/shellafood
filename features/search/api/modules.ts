import { getServerLocale } from "@/features/language/getServerLocale";
import { GetSearchModulesResponse, SearchModule } from "@/features/search/types/modules.types";

export async function getSearchModules(): Promise<SearchModule[]> {
    const locale = await getServerLocale();
    const isArabic = locale === "ar";
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/modules?zone_id=${process.env.ZONE_ID}`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": isArabic ? "ar" : "en",
                "X-Localization": isArabic ? "ar" : "en",
            },
            next: {
                revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                tags: ["modules", "search-data"],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch modules: ${res.status}`);

    const body = await res.json();
    const modules: GetSearchModulesResponse = Array.isArray(body) ? body : body.data;

    return modules ?? [];
}
