import { NextRequest } from "next/server";
import { ResetPasswordRequest, ResetPasswordResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function putResetPassword(request: NextRequest) {
	try {
		const body: ResetPasswordRequest = await request.json();

		if (
			!body.phone?.trim() ||
			!body.reset_token?.trim() ||
			!body.password ||
			!body.confirm_password
		) {
			return apiError("جميع الحقول مطلوبة", 422);
		}

		if (body.password !== body.confirm_password) {
			return apiError("كلمتا المرور غير متطابقتين", 422);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/reset-password`, {
			method: "PUT",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({
				phone: body.phone.trim(),
				reset_token: body.reset_token.trim(),
				password: body.password,
				confirm_password: body.confirm_password,
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "تعذر تغيير كلمة المرور";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<ResetPasswordResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر تغيير كلمة المرور", 500);
	}
}
