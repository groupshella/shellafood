/**
 * Search API — `GET /api/v1/items/item-or-store-search`
 */

import { BASE_URL } from "@/features/auth/constants/auth.constants";
import { SEARCH_CONSTANTS } from "../constants/search.constants";
import type {
	ApiResponse,
	ItemOrStoreSearchResponse,
	SearchRequestContext,
} from "../types";

export interface ItemOrStoreSearchParams {
	name: string;
}

function buildSearchHeaders(ctx: SearchRequestContext): HeadersInit {
	const lang = ctx.lang ?? SEARCH_CONSTANTS.DEFAULT_LANG;

	return {
		Accept: "application/json",
		"X-localization": lang,
		zoneId: ctx.zoneId ?? SEARCH_CONSTANTS.DEFAULT_ZONE_ID,
		moduleId: "6",
		longitude: ctx.longitude ?? SEARCH_CONSTANTS.DEFAULT_LONGITUDE,
		latitude: ctx.latitude ?? SEARCH_CONSTANTS.DEFAULT_LATITUDE,
	};
}

/**
 * Search items and stores by name.
 * @see https://shellafood.com/api/v1/items/item-or-store-search
 */
export async function searchItemOrStore(
	params: ItemOrStoreSearchParams,
	context: SearchRequestContext = {},
): Promise<ApiResponse<ItemOrStoreSearchResponse>> {
	const name = params.name?.trim();
	if (!name) {
		return {
			success: true,
			data: { items: [], stores: [] },
		};
	}

	const qs = new URLSearchParams({ name });
	const url = `${BASE_URL}/api/v1/items/item-or-store-search?${qs.toString()}`;

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: buildSearchHeaders(context),
			cache: "no-store",
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({ message: "Network error" }));
			const message =
				(typeof err === "object" && err && "message" in err && typeof err.message === "string"
					? err.message
					: null) ?? `HTTP ${response.status}`;
			return { success: false, error: message };
		}

		const data = (await response.json()) as ItemOrStoreSearchResponse;
		return {
			success: true,
			data: {
				items: Array.isArray(data.items) ? data.items : [],
				stores: Array.isArray(data.stores) ? data.stores : [],
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Network error",
		};
	}
}

/** @deprecated Use searchItemOrStore */
export const searchProducts = searchItemOrStore;

/** @deprecated Only `name` is sent to item-or-store-search */
export type SearchApiParams = ItemOrStoreSearchParams;
