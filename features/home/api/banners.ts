import { Banner, Campaign, GetBannersResponse } from "@/features/home/types/banners.types";

export async function getBanners({ isArabic }: { isArabic: boolean }): Promise<{ banners: Banner[]; campaigns: Campaign[] }> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/banners?featured=1`,
        {
            headers: {
                Accept: "application/json",
                "X-localization": isArabic ? "ar" : "en",
                zoneId: process.env.ZONE_ID!,
            },
            next: {
                revalidate: 3600,
                tags: ["banners", "home-data"],
            },
        }
    );

    if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);

    const data: GetBannersResponse = await res.json();

    return {
        banners: data.banners ?? [],
        campaigns: data.campaigns ?? [],
    };
}