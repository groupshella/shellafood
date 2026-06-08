// features/home/hooks/useModules.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { GetModulesResponse, Module } from "@/features/home/types/modules.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseModulesReturn {
    modules: Module[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useModules(): UseModulesReturn {
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchModules = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/home/modules");
            const json = (await res.json()) as ApiResponse<GetModulesResponse>;
            const data = unwrap(json);
            setModules(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load modules");
            setModules([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    return { modules, isLoading, error, refetch: fetchModules };
}
