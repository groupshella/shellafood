"use client";

import { useCallback, useEffect, useState } from "react";
import {
    GetPopularBrandsResponse,
    PopularBrand,
} from "@/features/search/types/popular-brands.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UsePopularBrandsReturn {
    brands: PopularBrand[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function usePopularBrands(module_id: string | undefined): UsePopularBrandsReturn {
    const [brands, setBrands] = useState<PopularBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPopularBrands = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/search/popular-brands?module_id=${module_id}`);
            const json = (await res.json()) as ApiResponse<GetPopularBrandsResponse>;
            const data = unwrap(json);
            setBrands(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load popular brands");
            setBrands([]);
        } finally {
            setIsLoading(false);
        }
    }, [module_id]);

    useEffect(() => {
        fetchPopularBrands();
    }, [fetchPopularBrands]);

    return { brands, isLoading, error, refetch: fetchPopularBrands };
}
