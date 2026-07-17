import { describe, expect, it, vi } from "vitest";

import type { QidhaSubscriptionFormData } from "@/features/profile/types/qidha-subscription.types";
import {
	mapBackendFieldErrors,
	validateIncomeStep,
	validatePersonalStep,
} from "./qidha-subscription-validation";

function validForm(): QidhaSubscriptionFormData {
	return {
		firstName: "Ali",
		fatherName: "Ahmed",
		grandfatherName: "Saleh",
		familyName: "Hassan",
		birthDate: "1990-01-01",
		nationality: "Saudi",
		maritalStatus: "Single",
		familyCount: "1",
		idNumber: "1234567890",
		idExpiryDate: "2030-01-01",
		phone: "+966512345678",
		homeType: "Apartment",
		city: "Riyadh",
		neighborhood: "Olaya",
		incomeSource: "Salary",
		employerName: "Shella",
		monthlyIncome: "5000",
		salaryDay: "27",
		hasInstallments: "No",
		uploadedDoc: {
			file: new File(["document"], "salary.pdf", {
				type: "application/pdf",
			}),
			previewName: "salary.pdf",
		},
	};
}

describe("Qidha subscription validation", () => {
	it("accepts a valid adult Saudi application", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-17T12:00:00Z"));
		const form = validForm();
		expect(validatePersonalStep(form, "en")).toEqual({});
		expect(validateIncomeStep(form, "en")).toEqual({});
		vi.useRealTimers();
	});

	it("rejects invalid Saudi phone and underage applicants", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-17T12:00:00Z"));
		const form = {
			...validForm(),
			birthDate: "2012-01-01",
			phone: "123",
		};
		const errors = validatePersonalStep(form, "en");
		expect(errors.birthDate).toContain("18");
		expect(errors.phone).toContain("Saudi");
		vi.useRealTimers();
	});

	it("maps Laravel field errors to form fields", () => {
		expect(
			mapBackendFieldErrors({
				national_id: ["Invalid ID"],
				"attachments[]": ["Document required"],
			}),
		).toEqual({
			idNumber: "Invalid ID",
			uploadedDoc: "Document required",
		});
	});
});
