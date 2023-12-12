/**
 * Regular expression that matches an empty string.
 */
export const emptyRegex = new RegExp('^$', 'gi');

/**
 * Regular expression for matching special characters.
 */
export const specialCharRegex = new RegExp("[`!#%^&*()_=[\\]{};':|,.<>/?~]", 'gi');

/**
 * Creates a regular expression for highlighting specific values in a string.
 * @param values - An array of strings to be highlighted.
 * @returns A regular expression that matches the values and wraps them in <mark> tags.
 */
export const highlightRegex = (values: Array<string>) =>
	new RegExp(values.map((value) => `<mark>${value}</mark>`).join(''), 'gi');

/**
 * Creates a regular expression pattern that matches any of the specified values.
 *
 * @param values - An array of strings representing the values to match.
 * @returns A regular expression object that matches any of the specified values.
 */
export const normalRegex = (values: Array<string>) =>
	values.length ? new RegExp(`${values.join('|')}`, 'gi') : emptyRegex;

/**
 * Creates a regular expression that matches exact word matches from an array of values.
 * @param values - An array of strings to match.
 * @returns A regular expression object that matches the exact word matches.
 */
export const exactRegex = (values: Array<string>) =>
	values.length
		? new RegExp(values.map((value) => `(\\b${value}\\b)`).join('|'), 'gi')
		: emptyRegex;

/**
 * Creates a partial regex pattern based on an array of values.
 * The pattern matches any word that contains one of the values.
 *
 * @param values - An array of strings representing the values to match.
 * @returns A regular expression pattern that matches any word containing one of the values.
 */
export const partialRegex = (values: Array<string>) =>
	values.length ? new RegExp(`(?:^|(?=[^']))(\\b${values.join('|')}\\b)`, 'gi') : emptyRegex;

/**
 * Creates a regular expression pattern that matches any word in the given array of values.
 * The generated regular expression pattern excludes words that are surrounded by single quotes.
 *
 * @param values - An array of strings representing the words to be excluded.
 * @returns A regular expression pattern that matches the excluded words.
 */
export const excludeRegex = (values: Array<string>) =>
	values.length ? new RegExp(`(?:^|(?=[^']))(\\b${values.join('|')}\\b)`, 'gi') : emptyRegex;
