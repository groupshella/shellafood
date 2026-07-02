import { NextRequest } from "next/server";
import { RegisterRequest, RegisterResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postRegister(request: NextRequest) {
	try {
		const body: RegisterRequest = await request.json();

		if (
			!body.name?.trim() ||
			!body.phone?.trim() ||
			!body.password ||
			!body.confirm_password
		) {
			return apiError("الاسم ورقم الهاتف وكلمة المرور مطلوبة", 422);
		}

		// Backend needs `name` AND f_name/l_name — never rely on f_name/l_name alone.
		const payload = {
			name: body.name.trim(),
			f_name: body.f_name?.trim() || body.name.trim().split(" ")[0],
			l_name:
				body.l_name?.trim() ||
				body.name.trim().split(" ").slice(1).join(" ") ||
				body.name.trim(),
			phone: body.phone.trim(),
			password: body.password,
			confirm_password: body.confirm_password,
			...(body.email?.trim() && { email: body.email.trim() }),
		};

		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/sign-up`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": "ar",
			},
			body: JSON.stringify(payload),
		});

		const data = await backendRes.json();

		if (!backendRes.ok) {
			const message = data?.errors?.[0]?.message ?? "تعذر إنشاء الحساب";
			return apiError(message, backendRes.status);
		}

		return apiSuccess<RegisterResponse>(data, backendRes.status);
	} catch {
		return apiError("تعذر إنشاء الحساب", 500);
	}
}
