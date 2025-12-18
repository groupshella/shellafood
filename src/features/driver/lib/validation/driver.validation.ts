import { z } from 'zod';
import { DRIVER_CONSTANTS, PASSWORD_RULES, NAME_RULES, IDENTITY_NUMBER_RULES, VALIDATION_MESSAGES } from '../../constants/driver.constants';

/**
 * Driver registration form validation schema
 */
export const driverFormSchema = z.object({
	f_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.F_NAME.REQUIRED)
		.min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.F_NAME.MIN_LENGTH)
		.max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.F_NAME.MAX_LENGTH),
	l_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.L_NAME.REQUIRED)
		.min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.L_NAME.MIN_LENGTH)
		.max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.L_NAME.MAX_LENGTH),
	phone: z
		.string()
		.min(1, VALIDATION_MESSAGES.PHONE.REQUIRED),
	email: z
		.string()
		.min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
		.email(VALIDATION_MESSAGES.EMAIL.INVALID),
	password: z
		.string()
		.min(1, VALIDATION_MESSAGES.PASSWORD.REQUIRED)
		.min(PASSWORD_RULES.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH),
	identity_number: z
		.string()
		.min(1, VALIDATION_MESSAGES.IDENTITY_NUMBER.REQUIRED)
		.regex(IDENTITY_NUMBER_RULES.REGEX, VALIDATION_MESSAGES.IDENTITY_NUMBER.INVALID),
	identity_type: z
		.string()
		.min(1, VALIDATION_MESSAGES.IDENTITY_TYPE.REQUIRED)
		.refine(
			(val) => Object.values(DRIVER_CONSTANTS.IDENTITY_TYPES).includes(val as any),
			{ message: VALIDATION_MESSAGES.IDENTITY_TYPE.INVALID }
		),
	zone_id: z
		.string()
		.min(1, VALIDATION_MESSAGES.ZONE_ID.REQUIRED),
		identity_image: z
		.custom<File>((val) => val instanceof File, {
			message: VALIDATION_MESSAGES.IDENTITY_IMAGE.REQUIRED
		})
		.refine((file) => file.size > 0, {
			message: VALIDATION_MESSAGES.IDENTITY_IMAGE.REQUIRED
		})
		.refine((file) => file.size <= 4 * 1024 * 1024, {
			message: VALIDATION_MESSAGES.IDENTITY_IMAGE.INVALID
		}),
	
	driving_license_image: z
		.custom<File | null>()
		.optional()
		.refine((file) => !file || file.size <= 4 * 1024 * 1024, {
			message: VALIDATION_MESSAGES.IDENTITY_IMAGE.INVALID
		}),
	
	driver_license_image: z
		.custom<File | null>()
		.optional()
		.refine((file) => !file || file.size <= 4 * 1024 * 1024, {
			message: VALIDATION_MESSAGES.IDENTITY_IMAGE.INVALID
		}),
	agreed: z
		.boolean()
		.refine((val) => val === true, {
			message: VALIDATION_MESSAGES.AGREED.REQUIRED,
		}),
});
