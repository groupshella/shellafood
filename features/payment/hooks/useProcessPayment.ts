"use client";

import { useCallback, useState } from "react";
import type { ApiResponse } from "@/shared/lib/api-response";
import type {
	ProcessPaymentRequest,
	ProcessPaymentData,
} from "@/features/payment/types/payment.types";

interface UseProcessPaymentResult {
	processPayment: (
		payload: ProcessPaymentRequest,
		lang: "ar" | "en",
	) => Promise<ProcessPaymentData>;
	isLoading: boolean;
	error: string | null;
}

export function useProcessPayment(): UseProcessPaymentResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const processPayment = useCallback(
		async (payload: ProcessPaymentRequest, lang: "ar" | "en") => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await fetch("/api/payment/myfatoorah/process", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept-Language": lang,
						"X-localization": lang,
					},
					body: JSON.stringify(payload),
				});

				const json: ApiResponse<ProcessPaymentData> = await res.json();

				if (!json.success) {
					throw new Error(json.message);
				}

				return json.data;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to process payment";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { processPayment, isLoading, error };
}
