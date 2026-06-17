"use client";

import { useCallback, useEffect, useState } from "react";
import { GetOffersResponse, Offer } from "@/features/module/types/offers.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseOffersReturn {
    offers: Offer[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useOffers(module_id: string | undefined): UseOffersReturn {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOffers = useCallback(async () => {

        if (!module_id) {
            setOffers([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/module/offers?module_id=${module_id}`);
            const json = (await res.json()) as ApiResponse<GetOffersResponse>;
            const data = unwrap(json);
            setOffers(data.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load offers");
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
