/** Normalize Laravel / proxy cart list payloads to line rows with quantity. */
export function extractCartRowsForCount(payload: unknown): Array<{ quantity?: number }> {
	if (payload == null) return [];
	if (Array.isArray(payload)) return payload as Array<{ quantity?: number }>;
	if (typeof payload !== "object") return [];
	const o = payload as Record<string, unknown>;
	const nested =
		o.cart_items ??
		o.cartItems ??
		o.data ??
		o.items ??
		o.cart;
	if (Array.isArray(nested)) return nested as Array<{ quantity?: number }>;
	return [];
}

export function sumCartLineQuantities(rows: Array<{ quantity?: number }>): number {
	return rows.reduce((sum, row) => {
		const q = Number(row?.quantity);
		return sum + (Number.isFinite(q) && q > 0 ? q : 0);
	}, 0);
}
