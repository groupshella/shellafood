import "server-only";

import type { NextRequest } from "next/server";

import {
	customerHeaders,
	FINANCIAL_API,
	type FinancialLang,
	getFinancialToken,
	nafathHeaders,
	resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import {
	apiError,
	apiSuccess,
	extractBackendError,
	isBackendFailure,
} from "@/shared/lib/api-response";

type ValidationResult =
	| { ok: true; body: Record<string, unknown> }
	| { ok: false; message: string; errors?: unknown };

export function validateAmount(
	body: unknown,
	requireOrderId = false,
	lang: FinancialLang = "en",
): ValidationResult {
	if (!body || typeof body !== "object") {
		return { ok: false, message: "Invalid request body" };
	}
	const input = body as Record<string, unknown>;
	const amount = Number(input.amount);
	const errors: Record<string, string[]> = {};
	if (!Number.isFinite(amount) || amount <= 0) {
		errors.amount = [
			lang === "ar" ? "يجب أن يكون المبلغ أكبر من صفر" : "Amount must be greater than zero",
		];
	}
	if (
		requireOrderId &&
		(typeof input.order_id !== "string" || !input.order_id.trim())
	) {
		errors.order_id = [
			lang === "ar" ? "رقم الطلب مطلوب" : "Order ID is required",
		];
	}
	if (Object.keys(errors).length) {
		return { ok: false, message: "Validation failed", errors };
	}
	return {
		ok: true,
		body: requireOrderId
			? { amount, order_id: String(input.order_id).trim() }
			: { amount },
	};
}

export function validateNafathIdentity(
	body: unknown,
	lang: FinancialLang = "en",
): ValidationResult {
	if (!body || typeof body !== "object") {
		return { ok: false, message: "Invalid request body" };
	}
	const input = body as Record<string, unknown>;
	const nationalId = String(input.national_id ?? "").replace(/\D/g, "");
	const userId = Number(input.user_id);
	const errors: Record<string, string[]> = {};
	if (!/^1\d{9}$/.test(nationalId)) {
		errors.national_id = [
			lang === "ar"
				? "رقم هوية وطنية سعودي صحيح من 10 أرقام مطلوب"
				: "A valid 10-digit Saudi national ID is required",
		];
	}
	if (!Number.isInteger(userId) || userId <= 0) {
		errors.user_id = [
			lang === "ar" ? "معرّف المستخدم غير صالح" : "A valid user ID is required",
		];
	}
	if (Object.keys(errors).length) {
		return { ok: false, message: "Validation failed", errors };
	}
	return { ok: true, body: { national_id: nationalId, user_id: userId } };
}

export function validateNafathSign(
	body: unknown,
	lang: FinancialLang = "en",
): ValidationResult {
	if (!body || typeof body !== "object") {
		return { ok: false, message: "Invalid request body" };
	}
	const input = body as Record<string, unknown>;
	const nationalId = String(input.national_id ?? "").replace(/\D/g, "");
	const fields = ["city", "neighborhood", "house_type"] as const;
	const errors: Record<string, string[]> = {};
	if (!/^1\d{9}$/.test(nationalId)) {
		errors.national_id = [
			lang === "ar"
				? "رقم هوية وطنية سعودي صحيح من 10 أرقام مطلوب"
				: "A valid 10-digit Saudi national ID is required",
		];
	}
	for (const field of fields) {
		if (typeof input[field] !== "string" || !input[field].trim()) {
			const ar = {
				city: "المدينة مطلوبة",
				neighborhood: "الحي مطلوب",
				house_type: "نوع المنزل مطلوب",
			};
			errors[field] = [
				lang === "ar" ? ar[field] : `${field.replace("_", " ")} is required`,
			];
		}
	}
	if (Object.keys(errors).length) {
		return { ok: false, message: "Validation failed", errors };
	}
	return {
		ok: true,
		body: {
			national_id: nationalId,
			city: String(input.city).trim(),
			neighborhood: String(input.neighborhood).trim(),
			house_type: String(input.house_type).trim(),
		},
	};
}

async function parseJson(response: Response): Promise<unknown> {
	const text = await response.text();
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}

export async function proxyQidhaGet(request: NextRequest, path: string) {
	const token = await getFinancialToken();
	const lang = resolveFinancialLang(request);
	if (!token) return apiError(lang === "ar" ? "غير مصرح" : "Unauthorized", 401);
	if (!FINANCIAL_API.baseUrl) return apiError("API URL not configured", 500);

	try {
		const response = await fetch(`${FINANCIAL_API.baseUrl}${path}`, {
			headers: customerHeaders(token, lang, {
				contentType: false,
				dualModuleZone: true,
				includeGeo: true,
			}),
			cache: "no-store",
		});
		const json = await parseJson(response);
		const fallback = lang === "ar" ? "تعذر جلب محفظة قيدها" : "Could not load Qidha wallet";
		if (!response.ok) {
			return apiError(extractBackendError(json, fallback), response.status, (json as { errors?: unknown } | null)?.errors);
		}
		if (isBackendFailure(json)) {
			return apiError(
				extractBackendError(json, fallback),
				400,
				json.errors,
			);
		}
		return apiSuccess(
			json && typeof json === "object" && "data" in json
				? (json as { data: unknown }).data
				: json,
		);
	} catch {
		return apiError(lang === "ar" ? "تعذر الاتصال بالخدمة" : "Service unavailable", 502);
	}
}

export async function proxyQidhaPost(
	request: NextRequest,
	path: string,
	validate: (body: unknown, lang: FinancialLang) => ValidationResult,
	options: { nafath?: boolean } = {},
) {
	const token = await getFinancialToken();
	const lang = resolveFinancialLang(request);
	if (!token) return apiError(lang === "ar" ? "غير مصرح" : "Unauthorized", 401);
	if (!FINANCIAL_API.baseUrl) return apiError("API URL not configured", 500);

	let input: unknown;
	try {
		input = await request.json();
	} catch {
		return apiError(lang === "ar" ? "بيانات الطلب غير صالحة" : "Invalid request body", 400);
	}
	const validation = validate(input, lang);
	if (!validation.ok) {
		return apiError(
			lang === "ar" ? "تحقق من البيانات المدخلة" : validation.message,
			422,
			validation.errors,
		);
	}

	try {
		const response = await fetch(`${FINANCIAL_API.baseUrl}${path}`, {
			method: "POST",
			headers: options.nafath
				? nafathHeaders(token, lang)
				: customerHeaders(token, lang),
			body: JSON.stringify(validation.body),
			cache: "no-store",
		});
		const json = await parseJson(response);
		const fallback = lang === "ar" ? "تعذر إكمال العملية" : "Could not complete the request";
		if (!response.ok) {
			return apiError(extractBackendError(json, fallback), response.status, (json as { errors?: unknown } | null)?.errors);
		}
		if (
			json &&
			typeof json === "object" &&
			"success" in json &&
			(json as { success: unknown }).success === false
		) {
			return apiError(
				extractBackendError(json, fallback),
				400,
				(json as { errors?: unknown }).errors,
			);
		}
		return apiSuccess(
			json && typeof json === "object" && "data" in json
				? (json as { data: unknown }).data
				: json,
		);
	} catch {
		return apiError(lang === "ar" ? "تعذر الاتصال بالخدمة" : "Service unavailable", 502);
	}
}
