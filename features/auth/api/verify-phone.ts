import { NextRequest } from "next/server";
import { VerifyPhoneRequest, VerifyPhoneResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postVerifyPhone(request: NextRequest) {
	try {
		const body: VerifyPhoneRequest = await request.json();

		if (!body.phone?.trim() || !body.otp?.trim()) {
			return apiError("رقم الهاتف ورمز التفعيل مطلوبان", 422);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/verify-phone`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			// server expects otp and token to carry the same value
			body: JSON.stringify({
				phone: body.phone.trim(),
				otp: body.otp.trim(),
				token: body.otp.trim(),
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "رمز التفعيل غير صحيح";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<VerifyPhoneResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر التحقق من رمز التفعيل", 500);
	}
}
