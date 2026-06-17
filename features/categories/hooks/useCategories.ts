"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";
import { Category, CategoryDetails, SubCategory } from "../types/category-details.types";
import { useCategoryDetail } from "./useCategoryDetail";

interface UseCategoriesReturn {
    /** flat list of category tabs shown in the top bar */
    tabs: Category[];
    isLoadingTabs: boolean;
    tabsError: string | null;

    /** currently selected category id */
    activeCategoryId: string | number | null;
    setActiveCategoryId: (id: string | number) => void;

    /** detail (sub-categories + products) for the active category */
    activeDetail: CategoryDetails | null;
    isLoadingDetail: boolean;
    detailError: string | null;

    /** load more products inside a specific sub-category */
    loadMoreProducts: (subCategoryId: number) => Promise<void>;
}

const LIMIT = 20;

export function useCategories(
    storeId: string | undefined,
    initialCategoryId?: string | number | null,
): UseCategoriesReturn {
    const [tabs, setTabs] = useState<Category[]>([]);
    const [isLoadingTabs, setIsLoadingTabs] = useState(true);
    const [tabsError, setTabsError] = useState<string | null>(null);

    const [activeCategoryId, setActiveCategoryIdState] = useState<string | number | null>(
        initialCategoryId ?? null,
    );
    const {
        activeDetail,
        setActiveDetail,
        isLoadingDetail,
        detailError,
        detailCache,
        fetchDetail,
    } = useCategoryDetail(storeId);

    const fetchTabs = useCallback(async () => {
        if (!storeId) {
            setIsLoadingTabs(false);
            return;
        }
        setIsLoadingTabs(true);
        setTabsError(null);
        try {
            const res = await fetch(`/api/store/categories/details?id=${storeId}`);
            const json = (await res.json()) as ApiResponse<Category[]>;
            const data = unwrap(json);
            setTabs(data);
            if (initialCategoryId == null && data.length > 0) {
                setActiveCategoryIdState(data[0].id);
            }
        } catch (err) {
            setTabsError(err instanceof Error ? err.message : "Failed to load categories");
        } finally {
            setIsLoadingTabs(false);
        }
    }, [storeId, initialCategoryId]);

    const loadMoreProducts = useCallback(
        async (subCategoryId: number) => {
            if (!storeId || !activeCategoryId) return;

            setActiveDetail((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    sub_categories: prev.sub_categories.map((sc) =>
                        sc.id === subCategoryId ? { ...sc, isLoadingMore: true } : sc,
                    ),
                };
            });

            try {
                const cached = detailCache.current.get(activeCategoryId);
                const currentSub = cached?.sub_categories.find((sc) => sc.id === subCategoryId);
                const offset = currentSub?.products.length ?? 0;

                const res = await fetch(
                    `/api/store/categories/${activeCategoryId}?storeId=${storeId}&limit=${LIMIT}&offset=${offset}&subCategoryId=${subCategoryId}`,
                );
                const json = (await res.json()) as ApiResponse<SubCategory>;
                const moreData = unwrap(json);

                setActiveDetail((prev) => {
                    if (!prev) return prev;
                    const updated = {
                        ...prev,
                        sub_categories: prev.sub_categories.map((sc) =>
                            sc.id === subCategoryId
                                ? {
                                      ...sc,
                                      products: [...sc.products, ...moreData.products],
                                      has_more: moreData.has_more,
                                      isLoadingMore: false,
                                  }
                                : sc,
                        ),
                    };
                    detailCache.current.set(activeCategoryId, updated);
                    return updated;
                });
            } catch {
                setActiveDetail((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        sub_categories: prev.sub_categories.map((sc) =>
                            sc.id === subCategoryId ? { ...sc, isLoadingMore: false } : sc,
                        ),
                    };
                });
            }
        },
        [storeId, activeCategoryId, detailCache, setActiveDetail],
    );

    const setActiveCategoryId = useCallback(
        (id: string | number) => {
            setActiveCategoryIdState(id);
            fetchDetail(id);
        },
        [fetchDetail],
    );

    useEffect(() => {
        fetchTabs();
    }, [fetchTabs]);

    useEffect(() => {
        if (activeCategoryId != null) {
            fetchDetail(activeCategoryId);
        }
    }, [activeCategoryId, fetchDetail]);

    return {
        tabs,
        isLoadingTabs,
        tabsError,
        activeCategoryId,
        setActiveCategoryId,
        activeDetail,
        isLoadingDetail,
        detailError,
        loadMoreProducts,
    };
}
