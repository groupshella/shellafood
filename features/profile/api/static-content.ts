import { getServerLocale } from "@/features/language/getServerLocale";
import type {
    StaticContentResponse,
    StaticContentSlug,
} from "@/features/profile/types/static-content.types";

export async function getStaticContent(slug: StaticContentSlug): Promise<string> {
    const locale = await getServerLocale();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${slug}?lang=${locale}`,
        {
            headers: {
                Accept: "application/json",
                "X-localization": locale,
            },
            next: {
                revalidate: 86400,
                tags: ["static-content", `static-content-${slug}-${locale}`],
            },
        },
    );

    if (!res.ok) {
        throw new Error(
            locale === "ar"
                ? `تعذر تحميل المحتوى (${slug}): ${res.status}`
                : `Failed to fetch static content (${slug}): ${res.status}`,
        );
    }

    const json: StaticContentResponse = await res.json();
    return json.data?.content?.trim() ?? "";
}
