"use client";

import { useCallback, useState } from "react";
import type { ApiResponse } from "@/shared/lib/api-response";
import type { PaymentMethod } from "@/features/payment/types/payment.types";
import { useLanguage } from "@/features/language/useLanguage";
interface UseGetPaymentMethodsResult {
    getPaymentMethods: (amount: number, currency?: string) => Promise<PaymentMethod[]>;
    isLoading: boolean;
    error: string | null;
}

export function useGetPaymentMethods(): UseGetPaymentMethodsResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isArabic } = useLanguage();
    const getPaymentMethods = useCallback(async (amount: number, currency = "SAR") => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                amount: String(amount),
                currency,
            });

            const res = await fetch(`/api/payment/myfatoorah/payment-methods?${params}`, {
                headers: { "X-Localization": isArabic ? "ar" : "en" },
            });
            const json: ApiResponse<PaymentMethod[]> = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }

            return json.data;
        } catch (err) {
            const message = err instanceof Error ? isArabic ? "تعذر تحميل طرق الدفع" : "Failed to load payment methods" : (err as Error).message;
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { getPaymentMethods, isLoading, error };
}
