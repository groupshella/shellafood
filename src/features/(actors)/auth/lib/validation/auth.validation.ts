import { z } from 'zod';
import { PASSWORD_RULES, PHONE_RULES, NAME_RULES, VALIDATION_MESSAGES } from '../../constants/auth.constants';

/**
 * Login form validation schema
 */
// .min(PASSWORD_RULES.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH),
// 
export const loginSchema = z.object({
	phone: z
		.string()
		.min(1, VALIDATION_MESSAGES.PHONE.REQUIRED),
	password: z
		.string()
		.min(1, VALIDATION_MESSAGES.PASSWORD.REQUIRED),
	remember: z.boolean().optional(),
});

/**
 * Register form validation schema
 */
// .min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.NAME.MIN_LENGTH)
		// .max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.NAME.MAX_LENGTH),
		// .min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.NAME.MIN_LENGTH)
		// .max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.NAME.MAX_LENGTH),
		// .min(PASSWORD_RULES.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH)
		// .regex(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD.REQUIRE_UPPERCASE)
		// .regex(/[0-9]/, VALIDATION_MESSAGES.PASSWORD.REQUIRE_NUMBER),
export const registerSchema = z.object({
	first_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.NAME.REQUIRED),
	
	last_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.NAME.REQUIRED),
		
	phone: z
		.string()
		.min(1, VALIDATION_MESSAGES.PHONE.REQUIRED),
	email: z
		.string()
		.min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
		.email(VALIDATION_MESSAGES.EMAIL.INVALID),
	password: z
		.string()
		.min(1, VALIDATION_MESSAGES.PASSWORD.REQUIRED),
		
	password_confirmation: z
		.string()
		.min(1, 'تأكيد كلمة المرور مطلوب'),
	accept_terms: z
		.boolean()
		.refine((val) => val === true, {
			message: VALIDATION_MESSAGES.TERMS.REQUIRED,
		}),
}).refine((data) => data.password === data.password_confirmation, {
	message: VALIDATION_MESSAGES.PASSWORD.NOT_MATCH,
	path: ['password_confirmation'],
});
