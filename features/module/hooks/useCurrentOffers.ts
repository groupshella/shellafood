"use client";

import { useCallback, useEffect, useState } from "react";
import {
    CurrentOffer,
    GetCurrentOffersResponse,
} from "@/features/module/types/current-offers.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseCurrentOffersReturn {
    offers: CurrentOffer[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useCurrentOffers(module_id: string): UseCurrentOffersReturn {
    const [offers, setOffers] = useState<CurrentOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOffers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/module/current-offers?module_id=${module_id}`);
            const json = (await res.json()) as ApiResponse<GetCurrentOffersResponse>;
            const data = unwrap(json);
            setOffers(data.offers ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load current offers");
            setOffers([]);
        } finally {
            setIsLoading(false);
        }
    }, [module_id]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    return { offers, isLoading, error, refetch: fetchOffers };
}
