import { NextRequest } from "next/server";
import { LoginRequest, LoginResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postLogin(request: NextRequest) {
	try {
		const body: LoginRequest = await request.json();

		if (!body.phone?.trim() || !body.password?.trim()) {
			return apiError("رقم الهاتف وكلمة المرور مطلوبان", 422);
		}

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": "ar",
			},
			body: JSON.stringify({
				phone: body.phone.trim(),
				password: body.password,
			}),
		});

		const data = await backendRes.json();

		// A 403 + verification_required=true means "pending account", not a
		// wrong-password error — the client routes it to the OTP screen.
		// Pass it through as a 200 success so the hook can branch on shape.
		if (backendRes.status === 403 && data?.verification_required) {
			return apiSuccess<LoginResponse>(data, 200);
		}

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "رقم الهاتف أو كلمة المرور غير صحيحة";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<LoginResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر تسجيل الدخول، حاول مرة أخرى", 500);
	}
}
