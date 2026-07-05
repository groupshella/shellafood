"use client";

import { useCallback, useState } from "react";
import type { PlaceOrderPayload } from "@/features/checkout/types/checkout.types";
import type { PlaceOrderResponse } from "@/app/api/order/place/route";
import type { ApiResponse } from "@/shared/lib/api-response";

interface UsePlaceOrderResult {
    placeOrder: (payload: PlaceOrderPayload) => Promise<PlaceOrderResponse>;
    isLoading: boolean;
    error: string | null;
}

export function usePlaceOrder(): UsePlaceOrderResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const placeOrder = useCallback(async (payload: PlaceOrderPayload): Promise<PlaceOrderResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/order/place", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json: ApiResponse<PlaceOrderResponse> = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }

            return json.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "تعذر إتمام الطلب";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { placeOrder, isLoading, error };
}
