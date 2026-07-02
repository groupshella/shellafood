// features/payment/hooks/useCreatePaymentSession.ts
"use client";

import { useCallback, useState } from "react";
import { unwrap } from "@/shared/lib/api-response";
import type { CreateSessionData, CreateSessionRequest } from "@/features/payment/types/payment.types";

interface UseCreatePaymentSessionResult {
    createSession: (payload: CreateSessionRequest) => Promise<CreateSessionData>;
    isLoading: boolean;
    error: string | null;
}

/**
 * Talks ONLY to our own /app/api BFF route.
 * Never touches MyFatoorah directly, never sees card data.
 */
export function useCreatePaymentSession(): UseCreatePaymentSessionResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createSession = useCallback(async (payload: CreateSessionRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/payment/myfatoorah/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await unwrap<CreateSessionData>(await res.json());
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "تعذر إنشاء جلسة الدفع";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { createSession, isLoading, error };
}
