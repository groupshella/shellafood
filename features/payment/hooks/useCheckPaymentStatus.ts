"use client";

import { useCallback, useState } from "react";
import type { ApiResponse } from "@/shared/lib/api-response";
import type { CheckStatusData, CheckStatusRequest } from "@/features/payment/types/payment.types";
import { useLanguage } from "@/features/language/useLanguage";
interface UseCheckPaymentStatusResult {
    checkStatus: (payload: CheckStatusRequest) => Promise<CheckStatusData>;
    isLoading: boolean;
    error: string | null;
}

export function useCheckPaymentStatus(): UseCheckPaymentStatusResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isArabic } = useLanguage();
    const checkStatus = useCallback(async (payload: CheckStatusRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/payment/myfatoorah/check-status", {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Localization": isArabic ? "ar" : "en" },
                body: JSON.stringify(payload),
            });

            const json: ApiResponse<CheckStatusData> = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }

            return json.data;
        } catch (err) {
            const message = err instanceof Error ? isArabic ? "تعذر التحقق من حالة الدفع" : "Failed to check payment status" : (err as Error).message;
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { checkStatus, isLoading, error };
}
