import { NextRequest } from "next/server";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

function isArabicLocale(request: NextRequest): boolean {
	const loc =
		request.headers.get("x-localization") ??
		request.headers.get("X-localization");
	return loc !== "en";
}

export async function postForgotPassword(request: NextRequest) {
	const isArabic = isArabicLocale(request);
	const locale = isArabic ? "ar" : "en";

	try {
		const body: ForgotPasswordRequest = await request.json();

		if (!body.phone?.trim()) {
			return apiError(
				isArabic ? "رقم الهاتف مطلوب" : "Phone number is required",
				422,
			);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/forgot-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": locale,
			},
			body: JSON.stringify({ phone: body.phone.trim() }),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message =
				data?.errors?.[0]?.message ??
				(isArabic
					? "تعذر إرسال رمز التحقق"
					: "Could not send verification code");
			return apiError(message, backendRes.status);
		}

		return apiSuccess<ForgotPasswordResponse>(data, backendRes.status);
	} catch {
		return apiError(
			isArabic
				? "تعذر إرسال رمز التحقق"
				: "Could not send verification code",
			500,
		);
	}
}
