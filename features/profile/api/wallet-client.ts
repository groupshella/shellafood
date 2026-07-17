"use client";

import type {
	AddWalletRecipientRequest,
	ValidateWalletRecipientRequest,
	ValidateWalletRecipientResponse,
	WalletRecipient,
	WalletTransferRequest,
	WalletTransferResponse,
} from "@/features/profile/types/wallet.types";
import type { ApiResponse } from "@/shared/lib/api-response";

async function walletRequest<T>(
	url: string,
	lang: "ar" | "en",
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			lang,
			...(init?.headers ?? {}),
		},
	});
	const json = (await response.json()) as ApiResponse<T>;
	if (!response.ok || !json.success) {
		throw new Error(
			json.success
				? lang === "ar"
					? "تعذر إكمال الطلب"
					: "Could not complete the request"
				: json.message,
		);
	}
	return json.data;
}

export function getWalletRecipients(lang: "ar" | "en") {
	return walletRequest<WalletRecipient[] | { recipients?: WalletRecipient[] }>(
		"/api/profile/wallet/recipients",
		lang,
	).then((data) => (Array.isArray(data) ? data : data.recipients ?? []));
}

export function addWalletRecipient(
	payload: AddWalletRecipientRequest,
	lang: "ar" | "en",
) {
	return walletRequest<WalletRecipient>("/api/profile/wallet/recipients", lang, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export function deleteWalletRecipient(
	recipientId: string | number,
	lang: "ar" | "en",
) {
	return walletRequest<unknown>(
		`/api/profile/wallet/recipients/${encodeURIComponent(String(recipientId))}`,
		lang,
		{ method: "DELETE" },
	);
}

export function validateWalletRecipient(
	payload: ValidateWalletRecipientRequest,
	lang: "ar" | "en",
) {
	return walletRequest<ValidateWalletRecipientResponse>(
		"/api/profile/wallet/validate-recipient",
		lang,
		{ method: "POST", body: JSON.stringify(payload) },
	);
}

export function transferWalletFunds(
	payload: WalletTransferRequest,
	lang: "ar" | "en",
) {
	return walletRequest<WalletTransferResponse>("/api/profile/wallet/transfer", lang, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}
