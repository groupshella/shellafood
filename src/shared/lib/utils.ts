import { ALLOWED_VIDEO_EXTENSIONS, ALLOWED_VIDEO_TYPES, MEDIA_LIMITS } from "../constants/media-upload.constants";
import { ValidationResult, ValidationRule } from "../types/validation.types";

/**
 * Validates video file type
 */
export const validateVideoType = (file: File): boolean => {
	const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
	return ALLOWED_VIDEO_TYPES.includes(file.type as any) ||
		ALLOWED_VIDEO_EXTENSIONS.includes(fileExtension as any);
};

/**
 * Validates video file size
 */
export const validateVideoSize = (file: File): boolean => {
	return file.size <= MEDIA_LIMITS.MAX_VIDEO_SIZE;
};
//vido.mp4
/**
 * Validates video duration
 */
export const validateVideoDuration = (file: File): Promise<boolean> => {
	return new Promise((resolve) => {
		const videoElement = document.createElement('video');
		videoElement.preload = 'metadata';
		videoElement.src = URL.createObjectURL(file);

		videoElement.onloadedmetadata = () => {
			window.URL.revokeObjectURL(videoElement.src);
			resolve(videoElement.duration <= MEDIA_LIMITS.MAX_VIDEO_DURATION);
		};

		videoElement.onerror = () => {
			window.URL.revokeObjectURL(videoElement.src);
			resolve(false);
		};
	});
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const validators = {
	required: (value: any) => {
		if (typeof value === 'string') return value.trim() !== '';
		return value !== null && value !== undefined && value !== '';
	},

	requiredIf: (condition: boolean) => (value: any) => {
		if (!condition) return true;
		return validators.required(value);
	},

	minLength: (min: number) => (value: string) => {
		return value && value.trim().length >= min;
	},

	maxLength: (max: number) => (value: string) => {
		return !value || value.trim().length <= max;
	},

	pattern: (regex: RegExp) => (value: string) => {
		return !value || regex.test(value);
	},
};

/**
 * Validates form data against rules
 
 */
export function validateForm(
	data: Record<string, any>,
	rules: ValidationRule[]
): ValidationResult {
	const errors: Record<string, string> = {};
	let firstInvalidField: string | undefined;

	// Single pass validation - highly efficient
	for (const rule of rules) {
		if (!rule.validator(data[rule.field])) {
			errors[rule.field] = rule.message || `${rule.label} مطلوب`;

			// Capture only the first invalid field for scrolling
			if (!firstInvalidField) {
				firstInvalidField = rule.field;
			}
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		firstInvalidField,
		errors,
	};
}