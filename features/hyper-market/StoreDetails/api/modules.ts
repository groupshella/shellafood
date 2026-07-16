import { GetStoreModulesResponse, StoreModule } from "@/features/hyper-market/StoreDetails/types/modules.types";

export async function getStoreModules(lang: "ar" | "en"): Promise<StoreModule[]> {
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
                tags: ["modules", "hyper-market-data", `hyper-market-data-${lang}`],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch modules: ${res.status}`);

    const body = await res.json();
    const modules: GetStoreModulesResponse = Array.isArray(body) ? body : body.data;

    return modules ?? [];
}
