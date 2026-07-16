import {
    GetHyperMarketBannersResponse,
    HyperMarketBanner,
    HyperMarketCampaign,
} from "@/features/hyper-market/StoreDetails/types/banners.types";

export async function getHyperMarketBanners(lang: "ar" | "en"): Promise<{
    banners: HyperMarketBanner[];
    campaigns: HyperMarketCampaign[];
}> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/banners?featured=1`,
        {
            headers: {
                Accept: "application/json",
                "Accept-Language": lang,
                "X-Localization": lang,
                lang,
                zoneId: process.env.ZONE_ID!,
            },
            next: {
                revalidate: Number(process.env.REVALIDATE_TIME) || 3600,
                tags: ["banners", "hyper-market-data", `hyper-market-data-${lang}`],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);

    const data: GetHyperMarketBannersResponse = await res.json();

    return {
        banners: data.banners ?? [],
        campaigns: data.campaigns ?? [],
    };
}
