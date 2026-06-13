"use client";

import { useCallback, useEffect, useState } from "react";
import { Brand, GetBrandsResponse } from "@/features/module/types/brands.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseBrandsReturn {
    brands: Brand[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useBrands(moduleId: string | undefined): UseBrandsReturn {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBrands = useCallback(async () => {
        if (!moduleId) {
            setBrands([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/module/brands?moduleId=${moduleId}`);
            const json = (await res.json()) as ApiResponse<GetBrandsResponse>;
            const data = unwrap(json);
            setBrands(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load brands");
            setBrands([]);
        } finally {
            setIsLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return { brands, isLoading, error, refetch: fetchBrands };
}
