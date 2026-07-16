import { CurrentOffer, GetCurrentOffersResponse } from "@/features/home/types/current-offers.types";

export async function getCurrentOffers(
	lang: "ar" | "en",
	limit = 10,
	offset = 0
): Promise<CurrentOffer[]> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/v2/stores/offers?limit=${limit}&offset=${offset}`,
		{
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				zoneId: process.env.ZONE_ID!,
				latitude: process.env.NEXT_PUBLIC_LATITUDE!,
				longitude: process.env.NEXT_PUBLIC_LONGITUDE!,
				lang,
				"X-localization": lang,
			},
			next: {
				revalidate: 300,
				tags: ["current-offers", "home-data", `home-data-${lang}`],
			},
		}
	);

	if (!res.ok) throw new Error(`Failed to fetch offers: ${res.status}`);

	const data: GetCurrentOffersResponse = await res.json();

	return data.offers ?? [];
}
