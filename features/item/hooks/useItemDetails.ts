"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";
import { ItemDetails } from "@/features/item/types/item.types";
import { RelatedItem } from "@/features/item/types/related-items.types";
import { useRelatedItems } from "@/features/item/hooks/useRelatedItems";

interface UseItemDetailsReturn {
    item: ItemDetails | null;
    relatedItems: RelatedItem[];
    isLoading: boolean;
    isLoadingRelated: boolean;
    error: string | null;
    relatedError: string | null;
}

export function useItemDetails(itemId: string | undefined, moduleId: string | undefined): UseItemDetailsReturn {
    const [item, setItem] = useState<ItemDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {
        relatedItems,
        isLoading: isLoadingRelated,
        error: relatedError,
    } = useRelatedItems(itemId, moduleId);

    const fetchItem = useCallback(async () => {
        if (!itemId) {
            setItem(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/item/details?id=${itemId}&module_id=${moduleId}`);
            const json = (await res.json()) as ApiResponse<ItemDetails>;
            setItem(unwrap(json));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load item");
            setItem(null);
        } finally {
            setIsLoading(false);
        }
    }, [itemId, moduleId]);

    useEffect(() => {
        fetchItem();
    }, [fetchItem]);

    return {
        item,
        relatedItems,
        isLoading,
        isLoadingRelated,
        error,
        relatedError,
    };
}
