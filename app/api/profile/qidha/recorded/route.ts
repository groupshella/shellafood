import { type NextRequest } from "next/server";

import { getRecordedAnalytics } from "@/features/profile/api/qidha";
import { apiSuccess } from "@/shared/lib/api-response";
import type { RecordedAnalyticsInitialData } from "@/features/profile/types/statistics.types";

function resolveLang(req: NextRequest): "ar" | "en" {
	const header =
		req.headers.get("lang") ??
		req.headers.get("Accept-Language") ??
		req.headers.get("X-localization") ??
		"";
	return header.toLowerCase().startsWith("en") ? "en" : "ar";
}

export async function GET(req: NextRequest) {
	const lang = resolveLang(req);
	// getRecordedAnalytics never throws — always returns a safe UI payload.
	const data = await getRecordedAnalytics(lang);
	return apiSuccess<RecordedAnalyticsInitialData>(data);
}
