/** Build module listing URL (`/categories/{moduleId}`) */
export function moduleStoresPath(moduleId: number, query?: Record<string, string>) {
	const params = new URLSearchParams(query);
	const qs = params.toString();
	return `/categories/${moduleId}${qs ? `?${qs}` : ""}`;
}

/** Build category-scoped stores URL (`/categories/{moduleId}/stores/{categoryId}`) */
export function categoryStoresPath(
	moduleId: number,
	categoryId: number | string,
	query?: Record<string, string>,
) {
	const params = new URLSearchParams(query);
	const qs = params.toString();
	return `/categories/${moduleId}/stores/${categoryId}${qs ? `?${qs}` : ""}`;
}

/** Client/API URL for category stores proxy */
export function categoryStoresApiUrl(
	categoryId: number | string,
	opts: {
		moduleId: number;
		limit: number;
		offset: number;
		zoneId?: string;
		latitude?: string;
		longitude?: string;
	},
) {
	const params = new URLSearchParams({
		categoryId: String(categoryId),
		moduleId: String(opts.moduleId),
		limit: String(opts.limit),
		offset: String(opts.offset),
		zoneId: opts.zoneId ?? "[2]",
	});
	if (opts.latitude) params.set("latitude", opts.latitude);
	if (opts.longitude) params.set("longitude", opts.longitude);
	return `/api/category-stores?${params}`;
}
