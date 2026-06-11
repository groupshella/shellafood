"use client";

import { useCallback, useEffect, useState } from "react";
import { Category, GetCategoriesResponse } from "@/features/module/types/categories.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseCategoriesReturn {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useCategories(moduleId: string | undefined): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        if (!moduleId) {
            setCategories([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/module/categories?moduleId=${moduleId}`);
            const json = (await res.json()) as ApiResponse<GetCategoriesResponse>;
            const data = unwrap(json);
            setCategories(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load categories");
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, isLoading, error, refetch: fetchCategories };
}
