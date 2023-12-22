import { htmlRegex } from '$lib/utils';

/**
 * Sanitizes a string by removing HTML tags.
 *
 * @param value - The string to be sanitized.
 * @returns The sanitized string.
 */
export const sanitize = (value: string): string => {
	return value.replace(htmlRegex, '') || '';
};
