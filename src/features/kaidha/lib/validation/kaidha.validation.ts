/**
 * Kaidha form validation schema
 * Zod schema for kaidha registration form validation
 */

import { z } from "zod";
import { PHONE_RULES, VALIDATION_MESSAGES } from "../../constants/kaidha.constants";

export const kaidhaUserSchema = z.object({
	firstName: z.string().min(1, VALIDATION_MESSAGES.FIRST_NAME.REQUIRED),
	lastName: z.string().min(1, VALIDATION_MESSAGES.LAST_NAME.REQUIRED),
	fatherName: z.string().min(1, VALIDATION_MESSAGES.FATHER_NAME.REQUIRED),
	grandFatherName: z.string().optional().nullable(),
	birthDate: z.string().or(z.date()).optional().nullable(),
	nationality: z.string().optional().nullable(),
	socialStatus: z.string().optional().nullable(),
	familyMembersCount: z.string().or(z.number()).optional(),
	idType: z.string().min(1, VALIDATION_MESSAGES.ID_TYPE.REQUIRED),
	personalIdNumber: z.string().min(1, VALIDATION_MESSAGES.PERSONAL_ID_NUMBER.REQUIRED),
	idExpirationDate: z.string().or(z.date()).optional().nullable(),
	phoneNumber: z.string().regex(PHONE_RULES.PATTERN, VALIDATION_MESSAGES.PHONE_NUMBER.INVALID),
	whatsappNumber: z.string().optional().nullable(),
	email: z.string().email(VALIDATION_MESSAGES.EMAIL.INVALID).optional().nullable(),
	homeType: z.string().optional().nullable(),
	homeNature: z.string().optional().nullable(),
	city: z.string().min(1, VALIDATION_MESSAGES.CITY.REQUIRED),
	neighborhood: z.string().optional().nullable(),
	addressDetails: z.string().optional().nullable(),
	agreed: z.boolean().refine((val) => val === true, {
		message: VALIDATION_MESSAGES.AGREED.REQUIRED,
	}),
	companyName: z.string().optional().nullable(),
	jobTitle: z.string().optional().nullable(),
	yearsOfExperience: z.string().or(z.number()).optional(),
	grossSalary: z.string().optional().nullable(),
	locationWork: z.string().optional().nullable(),
	locationHouse: z.string().optional().nullable(),
	workAddress: z.string().optional().nullable(),
	installments: z.string().optional().nullable(),
	hasAdditionalIncome: z.string().optional().nullable(),
	additionalAmount: z.string().optional().nullable(),
	incomeSource: z.string().optional().nullable(),
});

export type KaidhaUserInput = z.infer<typeof kaidhaUserSchema>;
