import { describe, expect, it } from "vitest";

import { formatSar, isEmptyBalance, parseAmount } from "./balance";

describe("checkout balances", () => {
	it("parses formatted SAR balances", () => {
		expect(parseAmount("250.50 ﷼")).toBe(250.5);
		expect(parseAmount(null)).toBe(0);
	});

	it("detects empty balances and formats amounts", () => {
		expect(isEmptyBalance("0.00 ﷼")).toBe(true);
		expect(isEmptyBalance("0.01 ﷼")).toBe(false);
		expect(formatSar(50)).toBe("50.00 ﷼");
	});
});
