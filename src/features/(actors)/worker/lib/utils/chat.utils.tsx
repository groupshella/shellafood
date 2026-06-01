/**
 * Chat utility functions
 */
import React from "react";
import { Check, CheckCheck } from "lucide-react";
import type { Message } from "../../types/worker.types";

/**
 * Formats a date to a localized time string
 * @param date - The date to format
 * @param isArabic - Whether to use Arabic locale
 * @returns Formatted time string
 */
export const formatTime = (date: Date, isArabic: boolean = false): string => {
	return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
		hour: '2-digit',
		minute: '2-digit'
	});
};

/**
 * Returns the appropriate status icon for a message status
 * @param status - The message status
 * @returns React element representing the status icon
 */
export const getStatusIcon = (status: Message['status']): React.ReactElement | null => {
	switch (status) {
		case 'sent':
			return <Check className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
		case 'delivered':
			return <CheckCheck className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
		case 'read':
			return <CheckCheck className="w-4 h-4 text-blue-500" />;
		default:
			return null;
	}
};

