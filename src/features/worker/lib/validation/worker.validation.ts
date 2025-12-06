/**
 * Worker registration form validation schema
 */

import { z } from 'zod';
import { WORKER_CONSTANTS, NAME_RULES, ID_NUMBER_RULES, VALIDATION_MESSAGES } from '../../constants/worker.constants';

export const workerFormSchema = z.object({
	first_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.FIRST_NAME.REQUIRED)
		.min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.FIRST_NAME.MIN_LENGTH)
		.max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.FIRST_NAME.MAX_LENGTH),
	last_name: z
		.string()
		.min(1, VALIDATION_MESSAGES.LAST_NAME.REQUIRED)
		.min(NAME_RULES.MIN_LENGTH, VALIDATION_MESSAGES.LAST_NAME.MIN_LENGTH)
		.max(NAME_RULES.MAX_LENGTH, VALIDATION_MESSAGES.LAST_NAME.MAX_LENGTH),
	email: z
		.string()
		.min(1, VALIDATION_MESSAGES.EMAIL.REQUIRED)
		.email(VALIDATION_MESSAGES.EMAIL.INVALID),
	phone_number: z
		.string()
		.min(1, VALIDATION_MESSAGES.PHONE_NUMBER.REQUIRED),
	driver_type: z
		.string()
		.min(1, VALIDATION_MESSAGES.DRIVER_TYPE.REQUIRED)
		.refine(
			(val) => Object.values(WORKER_CONSTANTS.DRIVER_TYPES).includes(val as any),
			{ message: VALIDATION_MESSAGES.DRIVER_TYPE.INVALID }
		),
	area: z
		.string()
		.min(1, VALIDATION_MESSAGES.AREA.REQUIRED),
	vehicle_type: z
		.string()
		.min(1, VALIDATION_MESSAGES.VEHICLE_TYPE.REQUIRED)
		.refine(
			(val) => Object.values(WORKER_CONSTANTS.VEHICLE_TYPES).includes(val as any),
			{ message: VALIDATION_MESSAGES.VEHICLE_TYPE.INVALID }
		),
	id_type: z
		.string()
		.min(1, VALIDATION_MESSAGES.ID_TYPE.REQUIRED)
		.refine(
			(val) => Object.values(WORKER_CONSTANTS.ID_TYPES).includes(val as any),
			{ message: VALIDATION_MESSAGES.ID_TYPE.INVALID }
		),
	id_number: z
		.string()
		.min(1, VALIDATION_MESSAGES.ID_NUMBER.REQUIRED)
		.regex(ID_NUMBER_RULES.REGEX, VALIDATION_MESSAGES.ID_NUMBER.INVALID),
	id_image: z.string().optional(),
	zone_id: z.string().optional(),
	module_id: z.string().optional(),
});

