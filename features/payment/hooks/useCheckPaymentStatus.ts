"use client";

import { useCallback, useState } from "react";
import type { ApiResponse } from "@/shared/lib/api-response";
import type {
	CheckStatusData,
	CheckStatusRequest,
} from "@/features/payment/types/payment.types";

interface UseCheckPaymentStatusResult {
	checkStatus: (
		payload: CheckStatusRequest,
		lang: "ar" | "en",
	) => Promise<CheckStatusData>;
	isLoading: boolean;
	error: string | null;
}

export function useCheckPaymentStatus(): UseCheckPaymentStatusResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const checkStatus = useCallback(
		async (payload: CheckStatusRequest, lang: "ar" | "en") => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await fetch("/api/payment/myfatoorah/check-status", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept-Language": lang,
						"X-localization": lang,
					},
					body: JSON.stringify(payload),
				});

				const json: ApiResponse<CheckStatusData> = await res.json();

				if (!json.success) {
					throw new Error(json.message);
				}

				return json.data;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to check payment status";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { checkStatus, isLoading, error };
}
