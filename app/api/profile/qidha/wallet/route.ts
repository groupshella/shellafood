import type { NextRequest } from "next/server";

import { QIDHA_ENDPOINTS } from "@/features/profile/constants/qidha.constants";
import { proxyQidhaGet } from "@/features/profile/lib/qidha-route";

export async function GET(request: NextRequest) {
	return proxyQidhaGet(request, QIDHA_ENDPOINTS.wallet);
}
