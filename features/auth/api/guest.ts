import { NextRequest } from "next/server";
import { GuestRequestResponse } from "@/features/auth/types/auth.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

function isArabicLocale(request: NextRequest): boolean {
	const loc =
		request.headers.get("x-localization") ??
		request.headers.get("X-localization");
	return loc !== "en";
}

export async function postGuest(request?: NextRequest) {
	const isArabic = request ? isArabicLocale(request) : true;
	const locale = isArabic ? "ar" : "en";

	try {
		const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/guest/request`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-localization": locale,
			},
		});
		const data: GuestRequestResponse = await backendRes.json();
		if (!backendRes.ok) {
			return apiError(
				isArabic
					? "تعذر إنشاء جلسة الزائر"
					: "Failed to create guest session",
				backendRes.status,
			);
		}
		return apiSuccess<GuestRequestResponse>(data, backendRes.status);
	} catch {
		return apiError(
			isArabic
				? "تعذر إنشاء جلسة الزائر"
				: "Failed to create guest session",
			500,
		);
	}
}
