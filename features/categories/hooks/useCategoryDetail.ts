"use client";

import { useCallback, useRef, useState, type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";
import { CategoryDetails } from "@/features/categories/types/category-detail.types";

const LIMIT = 20;

interface UseCategoryDetailReturn {
    activeDetail: CategoryDetails | null;
    setActiveDetail: Dispatch<SetStateAction<CategoryDetails | null>>;
    isLoadingDetail: boolean;
    detailError: string | null;
    detailCache: MutableRefObject<Map<string | number, CategoryDetails>>;
    fetchDetail: (categoryId: string | number) => Promise<void>;
}

export function useCategoryDetail(storeId: string | undefined): UseCategoryDetailReturn {
    const [activeDetail, setActiveDetail] = useState<CategoryDetails | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const detailCache = useRef<Map<string | number, CategoryDetails>>(new Map());

    const fetchDetail = useCallback(
        async (categoryId: string | number) => {
            if (!storeId) return;

            if (detailCache.current.has(categoryId)) {
                setActiveDetail(detailCache.current.get(categoryId)!);
                return;
            }

            setIsLoadingDetail(true);
            setDetailError(null);
            try {
                const res = await fetch(
                    `/api/store/categories/${categoryId}?storeId=${storeId}&limit=${LIMIT}`,
                );
                const json = (await res.json()) as ApiResponse<CategoryDetails>;
                const data = unwrap(json);
                detailCache.current.set(categoryId, data);
                setActiveDetail(data);
            } catch (err) {
                setDetailError(
                    err instanceof Error ? err.message : "Failed to load category detail",
                );
            } finally {
                setIsLoadingDetail(false);
            }
        },
        [storeId],
    );

    return {
        activeDetail,
        setActiveDetail,
        isLoadingDetail,
        detailError,
        detailCache,
        fetchDetail,
    };
}
