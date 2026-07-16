import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";

export async function buildWishlistHeaders(options?: {
    /** When true, scopes the request to MODULE_ID (add/remove). Omit for list so all modules hydrate. */
    withModuleId?: boolean;
    lang?: "ar" | "en";
}): Promise<{
    headers: Record<string, string>;
    token: string | undefined;
}> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    const lang = options?.lang ?? "ar";

    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        "X-localization": lang,
        "Accept-Language": lang,
        lang,
        zoneId: process.env.ZONE_ID!,
    };

    if (options?.withModuleId) {
        headers.moduleId = process.env.MODULE_ID ?? "3";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return { headers, token };
}

export function getFavoritesApiUrl(path: string): string {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    return `${base}${path}`;
}
