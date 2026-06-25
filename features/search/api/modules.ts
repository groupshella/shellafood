import { GetSearchModulesResponse, SearchModule } from "@/features/search/types/modules.types";

export async function getSearchModules(): Promise<SearchModule[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/modules?zone_id=${process.env.ZONE_ID}`,
        {
            headers: {
                Accept: "application/json",
                "X-Localization": "ar",
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
