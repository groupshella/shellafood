/**
 * Partner registration form validation schema
 */

import { z } from 'zod';
import { NAME_RULES, STORE_NAME_RULES, ADDRESS_RULES, PASSWORD_RULES, VALIDATION_MESSAGES } from '../../constants/partner.constants';

export const partnerFormSchema = z.object({
	f_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.FIRST_NAME.REQUIRED)
		.min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.FIRST_NAME.MIN_LENGTH)
		.max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.FIRST_NAME.MAX_LENGTH),
	l_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.LAST_NAME.REQUIRED)
		.min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.LAST_NAME.MIN_LENGTH)
		.max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.LAST_NAME.MAX_LENGTH),
	email: z
		.string()
		.min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
		.email(VALIDATION_MESSAGES.EMAIL.INVALID),
	phone: z
		.string()
		.min(1, VALIDATION_MESSAGES.PHONE.REQUIRED),
	password: z
		.string()
		.min(1, VALIDATION_MESSAGES.PASSWORD.REQUIRED)
		.min(PASSWORD_RULES.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH),
	zoneId: z
		.string()
		.min(1, VALIDATION_MESSAGES.ZONE_ID.REQUIRED),
	moduleId: z
		.string()
		.min(1, VALIDATION_MESSAGES.MODULE_ID.REQUIRED),
	store_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.STORE_NAME.REQUIRED)
		.min(STORE_NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.STORE_NAME.MIN_LENGTH)
		.max(STORE_NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.STORE_NAME.MAX_LENGTH),
	address: z
		.string()
		.min(1, VALIDATION_MESSAGES.ADDRESS.REQUIRED)
		.min(ADDRESS_RULES.MIN_LENGTH, VALIDATION_MESSAGES.ADDRESS.MIN_LENGTH)
		.max(ADDRESS_RULES.MAX_LENGTH, VALIDATION_MESSAGES.ADDRESS.MAX_LENGTH),
	latitude: z
		.string()
		.min(1, VALIDATION_MESSAGES.LOCATION.REQUIRED)
		.refine((val) => {
			const lat = parseFloat(val);
			return !isNaN(lat) && lat >= -90 && lat <= 90;
		}, { message: VALIDATION_MESSAGES.LOCATION.REQUIRED }),
	longitude: z
		.string()
		.min(1, VALIDATION_MESSAGES.LOCATION.REQUIRED)
		.refine((val) => {
			const lng = parseFloat(val);
			return !isNaN(lng) && lng >= -180 && lng <= 180;
		}, { message: VALIDATION_MESSAGES.LOCATION.REQUIRED }),
	logo: z.string().optional(),
	cover_photo: z.string().optional(),
	agreed: z
		.boolean()
		.refine((val) => val === true, { message: VALIDATION_MESSAGES.TERMS.REQUIRED }),
});

