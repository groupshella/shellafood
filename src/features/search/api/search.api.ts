import { StoreSearchParams, SearchContext, ApiResult, StoreSearchResponse } from "../types/search.types";

export async function searchStores(
	params: StoreSearchParams,
	ctx: SearchContext,
): Promise<ApiResult> {
	const qs = new URLSearchParams({
		name: params.name,
		type: params.type ?? "all",
		limit: String(params.limit ?? 10),
		offset: String(params.offset ?? 1),
	});
	if (params.category_id) qs.set("category_id", String(params.category_id));
	if (ctx.zoneId) qs.set("zoneId", ctx.zoneId);
	if (ctx.moduleId) qs.set("moduleId", ctx.moduleId);
	if (ctx.longitude) qs.set("longitude", ctx.longitude);
	if (ctx.latitude) qs.set("latitude", ctx.latitude);
	if (ctx.lang) qs.set("lang", ctx.lang);

	try {
		const res = await fetch(`/api/search/stores?${qs}`, {
			method: "GET",
			headers: { Accept: "application/json" },
			cache: "no-store",
		});

		if (!res.ok) {
			const err = await res.json().catch(() => null);
			const msg = err?.errors?.[0]?.message ?? err?.message ?? `HTTP ${res.status}`;
			return { success: false, error: msg };
		}

		const data: StoreSearchResponse = await res.json();
		return { success: true, data };
	} catch (e) {
		return { success: false, error: e instanceof Error ? e.message : "Network error" };
	}
}