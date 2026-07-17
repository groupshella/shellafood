import type { NextRequest } from "next/server";

import {
	customerHeaders,
	fetchCustomerInfo,
	FINANCIAL_API,
	getFinancialToken,
	resolveFinancialLang,
} from "@/features/profile/lib/financial-http";
import {
	apiError,
	apiSuccess,
	extractBackendError,
	isBackendFailure,
} from "@/shared/lib/api-response";

const BACKEND_URL = FINANCIAL_API.baseUrl;

/**
 * POST /api/v1/customer/loyalty-point/point-transfer
 * Body: { point: number }
 */
export async function POST(req: NextRequest) {
	const lang = resolveFinancialLang(req);
	const isArabic = lang === "ar";
	const token = await getFinancialToken();
	if (!token) return apiError("Unauthorized", 401);
	if (!BACKEND_URL) return apiError("API URL not configured", 500);

	let body: { point?: number; points?: number };
	try {
		body = await req.json();
	} catch {
		return apiError("Invalid request body", 400);
	}

	const point = Number(body.point ?? body.points ?? 0);
	if (!Number.isFinite(point) || point <= 0) {
		return apiError(
			isArabic
				? "يجب تحديد عدد النقاط المراد تحويلها"
				: "Please specify how many points to convert",
			400,
		);
	}

	try {
		const customer = await fetchCustomerInfo(token, null, lang);
		if (!customer) {
			return apiError(
				isArabic
					? "تعذر التحقق من رصيد النقاط"
					: "Could not verify points balance",
				502,
			);
		}
		const available = Number(customer.loyalty_point ?? 0);
		if (!Number.isFinite(available) || point > available) {
			return apiError(
				isArabic
					? "رصيد النقاط المتاح غير كافٍ"
					: "Insufficient available points",
				400,
			);
		}

		const res = await fetch(
			`${BACKEND_URL}/api/v1/customer/loyalty-point/point-transfer`,
			{
				method: "POST",
				headers: customerHeaders(token, lang),
				body: JSON.stringify({ point }),
			},
		);

		const json = await res.json();
		if (!res.ok) {
			return apiError(
				extractBackendError(
					json,
					isArabic ? "فشل في تحويل النقاط" : "Failed to convert points",
				),
				res.status,
			);
		}
		if (isBackendFailure(json)) {
			return apiError(
				extractBackendError(
					json,
					isArabic ? "فشل في تحويل النقاط" : "Failed to convert points",
				),
				400,
				json.errors,
			);
		}

		return apiSuccess(json?.data ?? json);
	} catch {
		return apiError(
			isArabic
				? "فشل في تحويل النقاط إلى المحفظة"
				: "Failed to convert points to wallet",
			502,
		);
	}
}
