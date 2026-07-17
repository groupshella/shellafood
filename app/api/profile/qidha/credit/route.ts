import type { NextRequest } from "next/server";

import { QIDHA_ENDPOINTS } from "@/features/profile/constants/qidha.constants";
import { proxyQidhaPost, validateAmount } from "@/features/profile/lib/qidha-route";

export async function POST(request: NextRequest) {
	return proxyQidhaPost(request, QIDHA_ENDPOINTS.credit, (body, lang) =>
		validateAmount(body, false, lang),
	);
}
