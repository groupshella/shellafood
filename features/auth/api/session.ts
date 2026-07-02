import { NextRequest, NextResponse } from "next/server";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_OPTS = {
	httpOnly: false,
	secure: IS_PROD,
	sameSite: "lax" as const,
	path: "/",
};

export async function postSession(request: NextRequest) {
	const body = await request.json();
	const response = NextResponse.json({ success: true });

	if (body.token) {
		response.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, body.token, {
			...COOKIE_OPTS,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
		});
	}

	if (body.user) {
		response.cookies.set(COOKIE_KEYS.USER, JSON.stringify(body.user), {
			...COOKIE_OPTS,
			maxAge: 60 * 60 * 24 * 30,
		});
	}

	if (body.guest_id) {
		response.cookies.set(COOKIE_KEYS.GUEST_ID, String(body.guest_id), {
			...COOKIE_OPTS,
			maxAge: 60 * 60 * 24 * 7,
		});
	}

	return response;
}

export async function deleteSession() {
	const response = NextResponse.json({ success: true });

	response.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN);
	response.cookies.delete(COOKIE_KEYS.USER);
	response.cookies.delete(COOKIE_KEYS.GUEST_ID);

	return response;
}
