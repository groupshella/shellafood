import { type NextRequest } from "next/server";

import {
	customerHeaders,
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

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ recipientId: string }> },
) {
	const lang = resolveFinancialLang(req);
	const token = await getFinancialToken();
	if (!token) return apiError(lang === "ar" ? "غير مصرح" : "Unauthorized", 401);

	const { recipientId } = await params;
	if (!recipientId || !/^[A-Za-z0-9_-]+$/.test(recipientId)) {
		return apiError(lang === "ar" ? "المستلم غير صالح" : "Invalid recipient", 400);
	}

	try {
		const response = await fetch(
			`${FINANCIAL_API.baseUrl}/api/v1/customer/wallet/recipients/${encodeURIComponent(recipientId)}`,
			{
				method: "DELETE",
				headers: customerHeaders(token, lang),
			},
		);
		const json = await response.json();
		if (!response.ok) {
			return apiError(
				extractBackendError(
					json,
					lang === "ar" ? "تعذر حذف المستلم" : "Could not delete recipient",
				),
				response.status,
				json?.errors,
			);
		}
		if (isBackendFailure(json)) {
			return apiError(
				extractBackendError(
					json,
					lang === "ar" ? "تعذر حذف المستلم" : "Could not delete recipient",
				),
				400,
				json.errors,
			);
		}
		return apiSuccess(json?.data ?? json);
	} catch {
		return apiError(
			lang === "ar" ? "تعذر حذف المستلم" : "Could not delete recipient",
			502,
		);
	}
}
