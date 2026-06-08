// features/home/hooks/useBanners.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { Banner, Campaign, GetBannersResponse } from "@/features/home/types/banners.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseBannersReturn {
    banners: Banner[];
    campaigns: Campaign[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useBanners(): UseBannersReturn {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBanners = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/home/banners");
            const json = await res.json() as ApiResponse<GetBannersResponse>;

            // unwrap() throws if success=false, so the catch block handles errors
            const data = unwrap(json);
            setBanners(data.banners ?? []);
            setCampaigns(data.campaigns ?? []);
        } catch (err) {
            setError(err as string);
            setBanners([]);
            setCampaigns([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchBanners(); }, [fetchBanners]);

    return { banners, campaigns, isLoading, error, refetch: fetchBanners };
}