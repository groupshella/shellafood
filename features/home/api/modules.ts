import { GetModulesResponse, Module } from "@/features/home/types/modules.types";

export async function getModules(lang: "ar" | "en"): Promise<Module[]> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/v2/modules?zone_id=${process.env.ZONE_ID}`,
		{
			headers: {
				Accept: "application/json",
				"Accept-Language": lang,
				"X-Localization": lang,
				lang,
			},
			next: {
				revalidate: 3600,
				tags: ["modules", "home-data", `home-data-${lang}`],
			},
		}
	);

	if (!res.ok) throw new Error(`Failed to fetch modules: ${res.status}`);

	const body = await res.json();
	const modules: GetModulesResponse = Array.isArray(body) ? body : body.data;

	return modules ?? [];
}
