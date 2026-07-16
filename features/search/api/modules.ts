import { GetSearchModulesResponse, SearchModule } from "@/features/search/types/modules.types";

export async function getSearchModules(lang: "ar" | "en"): Promise<SearchModule[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/modules?zone_id=${process.env.ZONE_ID}`,
        {
            headers: {
                Accept: "application/json",
                "X-Localization": lang,
                "Accept-Language": lang,
                lang,
            },
            next: {
                revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                tags: ["modules", "search-data", `search-data-${lang}`],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch modules: ${res.status}`);

    const body = await res.json();
    const modules: GetSearchModulesResponse = Array.isArray(body) ? body : body.data;

    return modules ?? [];
}
