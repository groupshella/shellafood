import { cookies } from "next/headers";

import { LOCALE_COOKIE, type AppLocale } from "@/features/profile/constants/profile.strings";

/** Resolve the active app locale for server actions / API routes. */
export async function getServerLocale(): Promise<AppLocale> {
    const store = await cookies();
    const value =
        store.get("shellafood-lang")?.value ??
        store.get(LOCALE_COOKIE)?.value ??
        store.get("app_locale")?.value;
    return value === "en" ? "en" : "ar";
}
