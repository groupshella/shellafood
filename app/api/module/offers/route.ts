import { GetOffersResponse } from "@/features/markets/types/offers.types";
import { apiError, apiSuccess } from "@/shared/lib/api-response";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const ZONE_ID = process.env.ZONE_ID;
const REVALIDATE_TIME = process.env.REVALIDATE_TIME;
const Module_ID = process.env.Module_ID;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const lang = searchParams.get("lang") === "en" ? "en" : "ar";
	const moduleId = searchParams.get("module_id") ?? Module_ID!;

	try {
		const backendRes = await fetch(`${BACKEND_URL}/api/v1/offers/active`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Accept-Language": lang,
				"X-Localization": lang,
				lang,
				zoneId: ZONE_ID!,
				moduleId,
			},
			next: { revalidate: Number(REVALIDATE_TIME) },
		});
		if (!backendRes.ok) {
			return apiError("Failed to get offers", backendRes.status);
		}
		const data: GetOffersResponse = await backendRes.json();
		return apiSuccess<GetOffersResponse>(data, backendRes.status);
	} catch {
		return apiError("Failed to get offers", 500);
	}
}
