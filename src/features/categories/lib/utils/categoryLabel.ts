import type { ApiCategory } from "../../types/api-category.types";

/** Resolved display name from API name or translations */
export function getCategoryLabel(category: ApiCategory, isArabic: boolean): string {
	if (isArabic) {
		const ar = category.translations?.find((t) => t.locale === "ar" && t.key === "name");
		if (ar?.value) return ar.value;
	}
	const en = category.translations?.find((t) => t.locale === "en" && t.key === "name");
	if (!isArabic && en?.value) return en.value;
	return category.name;
}
