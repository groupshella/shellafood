import { NextRequest } from "next/server";
import { VerifyTokenRequest, VerifyTokenResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

function isArabicLocale(request: NextRequest): boolean {
	const loc =
		request.headers.get("x-localization") ??
		request.headers.get("X-localization");
	return loc !== "en";
}

export async function postVerifyToken(request: NextRequest) {
	const isArabic = isArabicLocale(request);
	const locale = isArabic ? "ar" : "en";

	try {
		const body: VerifyTokenRequest = await request.json();

		if (!body.phone?.trim() || !body.reset_token?.trim()) {
			return apiError(
				isArabic
					? "رقم الهاتف ورمز التحقق مطلوبان"
					: "Phone number and verification code are required",
				422,
			);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/verify-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": locale,
			},
			// IMPORTANT: this endpoint uses reset_token, never `token`.
			body: JSON.stringify({
				phone: body.phone.trim(),
				reset_token: body.reset_token.trim(),
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message =
				data?.errors?.[0]?.message ??
				(isArabic
					? "رمز التحقق غير صحيح"
					: "Invalid verification code");
			return apiError(message, backendRes.status);
		}

		return apiSuccess<VerifyTokenResponse>(data, backendRes.status);
	} catch {
		return apiError(
			isArabic ? "تعذر التحقق من الرمز" : "Could not verify the code",
			500,
		);
	}
}
