"use client";

import { useCallback, useState } from "react";
import type { ApiResponse } from "@/shared/lib/api-response";
import type { PaymentMethod } from "@/features/payment/types/payment.types";

interface UseGetPaymentMethodsResult {
	getPaymentMethods: (
		amount: number,
		currency: string | undefined,
		lang: "ar" | "en",
	) => Promise<PaymentMethod[]>;
	isLoading: boolean;
	error: string | null;
}

export function useGetPaymentMethods(): UseGetPaymentMethodsResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getPaymentMethods = useCallback(
		async (amount: number, currency = "SAR", lang: "ar" | "en" = "ar") => {
			setIsLoading(true);
			setError(null);

			try {
				const params = new URLSearchParams({
					amount: String(amount),
					currency,
					lang,
				});

				const res = await fetch(`/api/payment/myfatoorah/payment-methods?${params}`);
				const json: ApiResponse<PaymentMethod[]> = await res.json();

				if (!json.success) {
					throw new Error(json.message);
				}

				return json.data;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to load payment methods";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { getPaymentMethods, isLoading, error };
}
