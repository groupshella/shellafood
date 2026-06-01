"use client";
// src/features/(modules)/stores/hooks/useStores.ts
import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { getAllStores } from "../api/stores.api";
import type { Stores } from "../types/stores.type";

interface UseStoresOptions {
    initialStores: Stores;
    moduleId: number;
    initialPage: number;
    initialLimit: number;
    zoneId: number;
    longitude: string;
    latitude: string;
    language: string;
}

export function useAllStores({
    initialStores,
    moduleId,
    initialPage,
    initialLimit,
    zoneId,
    longitude,
    latitude,
    language,
}: UseStoresOptions) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentPage = Number(searchParams.get("page")) || initialPage;

    const swrKey = useMemo(
        () => ["stores", moduleId, currentPage, initialLimit, language, zoneId] as const,
        [moduleId, currentPage, initialLimit, language, zoneId],
    );

    const { data: storeList, isLoading, error } = useSWR(
        swrKey,
        () => getAllStores(initialLimit, currentPage, language, moduleId, zoneId, longitude, latitude),
        {
            fallbackData: initialStores,
            revalidateOnMount: false,
            revalidateOnFocus: false,
            keepPreviousData: true,
            dedupingInterval: 10000,
        },
    );

    const totalPages = storeList ? Math.ceil(storeList.total_size / initialLimit) : 1;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        window.scrollTo({ top: 0, behavior: "smooth" });
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: true });
        });
    };

    return {
        storeList,
        isLoading,
        error,
        isPending,
        currentPage,
        totalPages,
        handlePageChange,
    };
}
