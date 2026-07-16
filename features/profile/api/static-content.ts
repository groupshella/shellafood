import type {
	StaticContentResponse,
	StaticContentSlug,
} from "@/features/profile/types/static-content.types";

export async function getStaticContent(
	slug: StaticContentSlug,
	lang: "ar" | "en",
): Promise<string> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${slug}`, {
		headers: {
			Accept: "application/json",
			"Accept-Language": lang,
			"X-localization": lang,
			lang,
		},
		next: {
			revalidate: 86400,
			tags: ["static-content", `static-content-${slug}`, `static-content-${slug}-${lang}`],
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch static content (${slug}): ${res.status}`);
	}

	const json: StaticContentResponse = await res.json();
	return json.data?.content?.trim() ?? "";
}
