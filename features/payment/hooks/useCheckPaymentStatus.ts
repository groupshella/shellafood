"use client";

import { useCallback, useState } from "react";
import type { ApiResponse } from "@/shared/lib/api-response";
import type { CheckStatusData, CheckStatusRequest } from "@/features/payment/types/payment.types";

interface UseCheckPaymentStatusResult {
    checkStatus: (payload: CheckStatusRequest) => Promise<CheckStatusData>;
    isLoading: boolean;
    error: string | null;
}

export function useCheckPaymentStatus(): UseCheckPaymentStatusResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkStatus = useCallback(async (payload: CheckStatusRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/payment/myfatoorah/check-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json: ApiResponse<CheckStatusData> = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }

            return json.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "تعذر التحقق من حالة الدفع";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { checkStatus, isLoading, error };
}
