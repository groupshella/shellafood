export const WALLET_TRANSACTION_PAGE_SIZE = 10;

/** Normalize supported Saudi mobile formats to the backend's E.164 contract. */
export function normalizeSaudiPhone(value: string): string | null {
	const phone = value.trim().replace(/[\s()-]/g, "");

	if (/^05\d{8}$/.test(phone)) return `+966${phone.slice(1)}`;
	if (/^9665\d{8}$/.test(phone)) return `+${phone}`;
	if (/^009665\d{8}$/.test(phone)) return `+${phone.slice(2)}`;
	if (/^\+9665\d{8}$/.test(phone)) return phone;

	return null;
}

export function isValidWalletPagination(offset: number, limit: number): boolean {
	return (
		Number.isInteger(offset) &&
		offset >= 0 &&
		Number.isInteger(limit) &&
		limit === WALLET_TRANSACTION_PAGE_SIZE &&
		offset % limit === 0
	);
}
