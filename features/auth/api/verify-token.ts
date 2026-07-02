import { NextRequest } from "next/server";
import { VerifyTokenRequest, VerifyTokenResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postVerifyToken(request: NextRequest) {
	try {
		const body: VerifyTokenRequest = await request.json();

		if (!body.phone?.trim() || !body.reset_token?.trim()) {
			return apiError("رقم الهاتف ورمز التحقق مطلوبان", 422);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/verify-token`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			// IMPORTANT: this endpoint uses reset_token, never `token`.
			body: JSON.stringify({
				phone: body.phone.trim(),
				reset_token: body.reset_token.trim(),
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "رمز التحقق غير صحيح";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<VerifyTokenResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر التحقق من الرمز", 500);
	}
}
