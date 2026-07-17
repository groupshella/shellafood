import { describe, expect, it } from "vitest";

import type { QidhaSubscriptionFormData } from "@/features/profile/types/qidha-subscription.types";
import {
	buildQidhaStoreFormData,
	normalizeSaudiPhone,
} from "./qidha-store-form";

describe("Qidha store form", () => {
	it.each([
		["0512345678", "+966512345678"],
		["+966 51 234 5678", "+966512345678"],
		["00966512345678", "+966512345678"],
	])("normalizes %s to E.164", (input, expected) => {
		expect(normalizeSaudiPhone(input)).toBe(expected);
	});

	it("uses the documented multipart field names", () => {
		const form: QidhaSubscriptionFormData = {
			firstName: " Ali ",
			fatherName: "Ahmed",
			grandfatherName: "Saleh",
			familyName: "Hassan",
			birthDate: "1990/01/02",
			nationality: "Saudi",
			maritalStatus: "Single",
			familyCount: "2",
			idNumber: "1234567890",
			idExpiryDate: "2030/01/02",
			phone: "0512345678",
			homeType: "Apartment",
			city: "Riyadh",
			neighborhood: "Olaya",
			incomeSource: "Salary",
			employerName: "Shella",
			monthlyIncome: "5000",
			salaryDay: "27",
			hasInstallments: "No",
			uploadedDoc: null,
		};
		const data = buildQidhaStoreFormData(form);
		expect(data.get("first_name")).toBe("Ali");
		expect(data.get("national_id")).toBe("1234567890");
		expect(data.get("identity_card_number")).toBe("1234567890");
		expect(data.get("mobile")).toBe("+966512345678");
		expect(data.get("installments")).toBe("0");
		expect(data.get("birth_date")).toBe("1990-01-02");
	});
});
