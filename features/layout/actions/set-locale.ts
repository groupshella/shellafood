"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";

import { LOCALE_COOKIE, type Locale } from "@/shared/lib/locale";

/** Cache tags that include localized module (and related) payloads. */
const LOCALE_DATA_TAGS = [
	"modules",
	"home-data",
	"home-data-ar",
	"home-data-en",
	"search-data",
	"search-data-ar",
	"search-data-en",
	"hyper-market-data",
	"hyper-market-data-ar",
	"hyper-market-data-en",
] as const;

export async function setLocale(locale: Locale) {
	if (locale !== "ar" && locale !== "en") return;

	const cookieStore = await cookies();
	cookieStore.set(LOCALE_COOKIE, locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365, // 1 year
	});

	for (const tag of LOCALE_DATA_TAGS) {
		updateTag(tag);
	}

	revalidatePath("/", "layout");
}
