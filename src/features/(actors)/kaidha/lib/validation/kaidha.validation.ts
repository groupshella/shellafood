/**
 * Kaidha form validation schema
 * Zod schema for kaidha registration form validation
 */

import { z } from "zod";
import { PHONE_RULES, VALIDATION_MESSAGES } from "../../constants/kaidha.constants";

export const kaidhaUserSchema = z.object({
	// Required fields
	firstName: z.string().min(1, VALIDATION_MESSAGES.FIRST_NAME.REQUIRED),
	grandFatherName: z.string().min(1, "Grandfather name is required"),
	fatherName: z.string().min(1, VALIDATION_MESSAGES.FATHER_NAME.REQUIRED),
	lastName: z.string().min(1, VALIDATION_MESSAGES.LAST_NAME.REQUIRED),
	birthDate: z.string().or(z.date()).refine((val) => val !== null && val !== undefined && val !== "", {
		message: "Birth date is required",
	}),
	personalIdNumber: z.string().min(1, VALIDATION_MESSAGES.PERSONAL_ID_NUMBER.REQUIRED),
	socialStatus: z.string().min(1, "Marital status is required"),
	familyMembersCount: z.string().or(z.number()).refine((val) => val !== null && val !== undefined && val !== "" && val !== 0, {
		message: "Number of family members is required",
	}),
	idExpirationDate: z.string().or(z.date()).refine((val) => val !== null && val !== undefined && val !== "", {
		message: "ID expiration date is required",
	}),
	phoneNumber: z.string().regex(PHONE_RULES.PATTERN, VALIDATION_MESSAGES.PHONE_NUMBER.INVALID),
	homeType: z.string().min(1, "House type is required"),
	city: z.string().min(1, VALIDATION_MESSAGES.CITY.REQUIRED),
	neighborhood: z.string().min(1, "Neighborhood is required"),
	companyName: z.string().min(1, "Company name is required"),
	grossSalary: z.string().min(1, "Total salary is required"),
	incomeSource: z.string().min(1, "Source of income is required"),
	additionalAmount: z.string().min(1, "Monthly amount is required"),
	salaryDay: z.string().min(1, "Salary day is required"),
	
	// Optional fields
	nationality: z.string().optional().nullable(),
	idType: z.string().optional().nullable(),
	whatsappNumber: z.string().optional().nullable(),
	email: z.string().email(VALIDATION_MESSAGES.EMAIL.INVALID).optional().nullable(),
	homeNature: z.string().optional().nullable(),
	addressDetails: z.string().optional().nullable(),
	locationHouse: z.string().optional().nullable(),
	jobTitle: z.string().optional().nullable(),
	yearsOfExperience: z.string().or(z.number()).optional(),
	locationWork: z.string().optional().nullable(),
	workAddress: z.string().optional().nullable(),
	installments: z.string().optional().nullable(),
	hasAdditionalIncome: z.string().optional().nullable(),
	agreed: z.boolean().optional().nullable(),
}).refine((data) => {
	// Validate installments - must have at least one installment with valid amount
	if (!data.installments || data.installments === "" || data.installments === "[]") {
		return false;
	}
	try {
		const installments = typeof data.installments === 'string' 
			? JSON.parse(data.installments) 
			: data.installments;
		if (Array.isArray(installments) && installments.length > 0) {
			const totalAmount = installments.reduce((sum, item) => {
				const amount = parseFloat(item.commitmentAmount || '0');
				return sum + (isNaN(amount) ? 0 : amount);
			}, 0);
			return totalAmount > 0;
		}
		return false;
	} catch {
		return false;
	}
}, {
	message: "At least one installment with amount is required",
	path: ["installments"],
});

export type KaidhaUserInput = z.infer<typeof kaidhaUserSchema>;
