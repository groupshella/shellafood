import {
	GetPopularBrandsResponse,
	PopularBrand,
} from "@/features/markets/types/popular-brands.types";

export async function getPopularBrands(
	moduleId: string,
	lang: "ar" | "en",
): Promise<PopularBrand[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/brands`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Accept-Language": lang,
			"X-Localization": lang,
			lang,
			moduleId,
		},
		next: { revalidate: Number(process.env.REVALIDATE_TIME), tags: ["popular-brands", `popular-brands-${lang}`] },
	});

	if (!res.ok) throw new Error(`Failed to fetch popular brands: ${res.status}`);

	const body = await res.json();
	const brands: GetPopularBrandsResponse = Array.isArray(body) ? body : (body.data ?? []);
	return brands;
}
