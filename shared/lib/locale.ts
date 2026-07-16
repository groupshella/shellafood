import "server-only";

import { cookies } from "next/headers";

export type Locale = "ar" | "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export async function getLocale(): Promise<Locale> {
	const cookieStore = await cookies();
	const value = cookieStore.get(LOCALE_COOKIE)?.value;
	return value === "en" || value === "ar" ? value : "ar";
}

export async function isArabicLocale(): Promise<boolean> {
	return (await getLocale()) === "ar";
}
