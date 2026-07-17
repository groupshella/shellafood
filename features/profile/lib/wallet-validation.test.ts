import { describe, expect, it } from "vitest";

import {
	isValidWalletPagination,
	normalizeSaudiPhone,
	WALLET_TRANSACTION_PAGE_SIZE,
} from "./wallet-validation";

describe("wallet validation", () => {
	it.each([
		["0512345678", "+966512345678"],
		["+966 51 234 5678", "+966512345678"],
		["966512345678", "+966512345678"],
		["00966512345678", "+966512345678"],
	])("normalizes %s to Saudi E.164", (input, expected) => {
		expect(normalizeSaudiPhone(input)).toBe(expected);
	});

	it.each(["", "123", "+971501234567", "966412345678", "phone0512345678"])(
		"rejects invalid Saudi mobile %s",
		(input) => {
			expect(normalizeSaudiPhone(input)).toBeNull();
		},
	);

	it("accepts only fixed-size row offsets", () => {
		expect(isValidWalletPagination(0, WALLET_TRANSACTION_PAGE_SIZE)).toBe(true);
		expect(isValidWalletPagination(20, WALLET_TRANSACTION_PAGE_SIZE)).toBe(true);
		expect(isValidWalletPagination(1, WALLET_TRANSACTION_PAGE_SIZE)).toBe(false);
		expect(isValidWalletPagination(-10, WALLET_TRANSACTION_PAGE_SIZE)).toBe(false);
		expect(isValidWalletPagination(10.5, WALLET_TRANSACTION_PAGE_SIZE)).toBe(false);
		expect(isValidWalletPagination(0, 100)).toBe(false);
	});
});
