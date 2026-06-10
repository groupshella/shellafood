"use client";

import { useCallback, useEffect, useState } from "react";
import {
    GetRecentOrdersResponse,
    RecentOrder,
} from "@/features/home/types/recent-orders.types";
import { ApiResponse, unwrap } from "@/shared/lib/api-response";

interface UseRecentOrdersReturn {
    orders: RecentOrder[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useRecentOrders(): UseRecentOrdersReturn {
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/home/recent-orders");
            const json = (await res.json()) as ApiResponse<GetRecentOrdersResponse>;
            const data = unwrap(json);
            setOrders(data.orders ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load recent orders");
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, isLoading, error, refetch: fetchOrders };
}
