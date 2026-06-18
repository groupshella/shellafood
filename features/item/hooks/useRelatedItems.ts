"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";
import { RelatedItem } from "@/features/item/types/related-items.types";

interface UseRelatedItemsReturn {
    relatedItems: RelatedItem[];
    isLoading: boolean;
    error: string | null;
}

export function useRelatedItems(itemId: string | undefined, moduleId: string | undefined): UseRelatedItemsReturn {
    const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRelated = useCallback(async () => {
        if (!itemId) {
            setRelatedItems([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/item/related?id=${itemId}&module_id=${moduleId}`);
            const json = (await res.json()) as ApiResponse<RelatedItem[]>;
            setRelatedItems(unwrap(json));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load related items");
            setRelatedItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [itemId, moduleId]);

    useEffect(() => {
        fetchRelated();
    }, [fetchRelated]);

    return { relatedItems, isLoading, error };
}
