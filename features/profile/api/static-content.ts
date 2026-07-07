import { cookies } from "next/headers";

import { LOCALE_COOKIE, type AppLocale } from "@/features/profile/constants/profile.strings";
import type {
    StaticContentResponse,
    StaticContentSlug,
} from "@/features/profile/types/static-content.types";

async function getLocale(): Promise<AppLocale> {
    const cookieStore = await cookies();
    const locale = cookieStore.get(LOCALE_COOKIE)?.value;
    return locale === "en" ? "en" : "ar";
}

export async function getStaticContent(slug: StaticContentSlug): Promise<string> {
    const locale = await getLocale();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${slug}`, {
        headers: {
            Accept: "application/json",
            "X-localization": locale,
        },
        next: {
            revalidate: 86400,
            tags: ["static-content", `static-content-${slug}`],
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch static content (${slug}): ${res.status}`);
    }

    const json: StaticContentResponse = await res.json();
    return json.data?.content?.trim() ?? "";
}
