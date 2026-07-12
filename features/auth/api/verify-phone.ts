import { NextRequest } from "next/server";
import { VerifyPhoneRequest, VerifyPhoneResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

function isArabicLocale(request: NextRequest): boolean {
	const loc =
		request.headers.get("x-localization") ??
		request.headers.get("X-localization");
	return loc !== "en";
}

export async function postVerifyPhone(request: NextRequest) {
	const isArabic = isArabicLocale(request);
	const locale = isArabic ? "ar" : "en";

	try {
		const body: VerifyPhoneRequest = await request.json();

		if (!body.phone?.trim() || !body.otp?.trim()) {
			return apiError(
				isArabic
					? "رقم الهاتف ورمز التفعيل مطلوبان"
					: "Phone number and activation code are required",
				422,
			);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/verify-phone`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": locale,
			},
			// server expects otp and token to carry the same value
			body: JSON.stringify({
				phone: body.phone.trim(),
				otp: body.otp.trim(),
				token: body.otp.trim(),
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message =
				data?.errors?.[0]?.message ??
				(isArabic
					? "رمز التفعيل غير صحيح"
					: "Invalid activation code");
			return apiError(message, backendRes.status);
		}

		return apiSuccess<VerifyPhoneResponse>(data, backendRes.status);
	} catch {
		return apiError(
			isArabic
				? "تعذر التحقق من رمز التفعيل"
				: "Could not verify activation code",
			500,
		);
	}
}
