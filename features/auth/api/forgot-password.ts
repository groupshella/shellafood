import { NextRequest } from "next/server";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postForgotPassword(request: NextRequest) {
	try {
		const body: ForgotPasswordRequest = await request.json();

		if (!body.phone?.trim()) {
			return apiError("رقم الهاتف مطلوب", 422);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/forgot-password`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({ phone: body.phone.trim() }),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "تعذر إرسال رمز التحقق";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<ForgotPasswordResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر إرسال رمز التحقق", 500);
	}
}
