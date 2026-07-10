"use client";

import { useCallback, useState } from "react";
import { placeOrder as placeOrderAction } from "@/features/checkout/actions/place-order";
import type {
    PlaceOrderPayload,
    PlaceOrderResponse,
} from "@/features/checkout/types/checkout.types";

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
            const result = await placeOrderAction(payload);

            if (!result.success || !result.data) {
                throw new Error(result.message ?? "تعذر إتمام الطلب");
            }

            return result.data;
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
