"use client";

import { useCallback, useState } from "react";
import { placeOrder as placeOrderAction } from "@/features/checkout/actions/place-order";
import type {
	PlaceOrderPayload,
	PlaceOrderResponse,
} from "@/features/checkout/types/checkout.types";

interface UsePlaceOrderResult {
	placeOrder: (
		payload: PlaceOrderPayload,
		lang: "ar" | "en",
	) => Promise<PlaceOrderResponse>;
	isLoading: boolean;
	error: string | null;
}

export function usePlaceOrder(): UsePlaceOrderResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const placeOrder = useCallback(
		async (
			payload: PlaceOrderPayload,
			lang: "ar" | "en",
		): Promise<PlaceOrderResponse> => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await placeOrderAction(payload, lang);

				if (!result.success || !result.data) {
					throw new Error(
						result.message ??
							(lang === "ar" ? "تعذر إتمام الطلب" : "Could not place the order"),
					);
				}

				return result.data;
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: lang === "ar"
							? "تعذر إتمام الطلب"
							: "Could not place the order";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { placeOrder, isLoading, error };
}
