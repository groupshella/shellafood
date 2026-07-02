import { NextRequest } from "next/server";
import { SendOtpAgainRequest, SendOtpAgainResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// NOTE: only used while otp_flow === "registration". The forgot-password
// flow re-sends its OTP by calling /auth/forgot-password again (see
// forgot-password.ts) — never this endpoint.
export async function postSendOtpAgain(request: NextRequest) {
	try {
		const body: SendOtpAgainRequest = await request.json();

		if (!body.phone?.trim()) {
			return apiError("رقم الهاتف مطلوب", 422);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/send-otp-again`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({
				phone: body.phone.trim(),
				otp_flow: body.otp_flow ?? "registration",
			}),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "تعذر إعادة إرسال رمز التفعيل";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<SendOtpAgainResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر إعادة إرسال رمز التفعيل", 500);
	}
}
