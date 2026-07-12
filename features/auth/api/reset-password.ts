import { NextRequest } from "next/server";
import { ResetPasswordRequest, ResetPasswordResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

function isArabicLocale(request: NextRequest): boolean {
	const loc =
		request.headers.get("x-localization") ??
		request.headers.get("X-localization");
	return loc !== "en";
}

export async function putResetPassword(request: NextRequest) {
	const isArabic = isArabicLocale(request);
	const locale = isArabic ? "ar" : "en";

	try {
		const body: ResetPasswordRequest = await request.json();

		if (
			!body.phone?.trim() ||
			!body.reset_token?.trim() ||
			!body.password ||
			!body.confirm_password
		) {
			return apiError(
				isArabic ? "جميع الحقول مطلوبة" : "All fields are required",
				422,
			);
		}

		if (body.password !== body.confirm_password) {
			return apiError(
				isArabic
					? "كلمتا المرور غير متطابقتين"
					: "Passwords do not match",
				422,
			);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/reset-password`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": locale,
			},
			body: JSON.stringify({
				phone: body.phone.trim(),
				reset_token: body.reset_token.trim(),
				password: body.password,
				confirm_password: body.confirm_password,
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message =
				data?.errors?.[0]?.message ??
				(isArabic
					? "تعذر تغيير كلمة المرور"
					: "Could not change password");
			return apiError(message, backendRes.status);
		}

		return apiSuccess<ResetPasswordResponse>(data, backendRes.status);
	} catch {
		return apiError(
			isArabic ? "تعذر تغيير كلمة المرور" : "Could not change password",
			500,
		);
	}
}
