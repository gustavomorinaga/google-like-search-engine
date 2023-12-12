/**
 * Sanitizes the given value by parsing it as HTML and returning the text content of the body.
 * @param value - The value to sanitize.
 * @returns The sanitized value.
 */
export const sanitize = (value: string): string => {
	const parser = new DOMParser();
	const dom = parser.parseFromString(value, 'text/html');
	return dom.body.textContent || '';
};
