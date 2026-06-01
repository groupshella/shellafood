/**
 * Phone number utility functions
 */

export function normalizePhoneNumber(phone: string, isArabic: boolean): string | null {
	// Remove spaces, dashes, and other non-digit characters except +
	let normalizedPhone = phone.replace(/[\s\-\(\)]/g, "");
	
	// Remove country code if present (966 or +966)
	if (normalizedPhone.startsWith("+966")) {
		normalizedPhone = normalizedPhone.substring(4);
	} else if (normalizedPhone.startsWith("966")) {
		normalizedPhone = normalizedPhone.substring(3);
	}
	
	// Remove any leading zeros
	normalizedPhone = normalizedPhone.replace(/^0+/, "");
	
	// Ensure we have 9 digits (without leading 0)
	if (normalizedPhone.length === 10 && normalizedPhone.startsWith("0")) {
		// If it's 10 digits starting with 0, remove the leading 0
		normalizedPhone = normalizedPhone.substring(1);
	}
	
	// Final validation - should be 9 digits (without leading 0)
	if (!/^\d{9}$/.test(normalizedPhone)) {
		return null;
	}
	
	// Format as +966XXXXXXXXX
	return "+966" + normalizedPhone;
}

