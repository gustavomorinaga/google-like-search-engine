/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Checks if a value is not null or undefined.
 * @param value - The value to check.
 * @returns True if the value is not null or undefined, false otherwise.
 */
export const notEmptyFilter = <T>(value: T | null | undefined): value is T =>
	value !== null && value !== undefined;

/**
 * Sorts an array of objects by their "createdAt" property in ascending order.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @returns A negative number if "a" is older than "b", a positive number if "a" is newer than "b", or 0 if they have the same creation date.
 */
export const sortByOldest = <T extends { createdAt: string }>(a: T, b: T): number =>
	a.createdAt < b.createdAt ? -1 : 1;

/**
 * Sorts an array of objects by their `createdAt` property in descending order.
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @returns A negative number if `a` should be placed before `b`, a positive number if `a` should be placed after `b`, or 0 if they are equal.
 */
export const sortByNewest = <T extends { createdAt: string }>(a: T, b: T): number =>
	a.createdAt > b.createdAt ? -1 : 1;

/**
 * Sorts an array of objects by their score property in descending order.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @returns A negative number if `a` should be sorted before `b`, a positive number if `b` should be sorted before `a`, or 0 if they have the same score.
 */
export const sortByRelevance = <T extends { score: number }>(a: T, b: T): number =>
	a.score > b.score ? -1 : 1;

/**
 * Represents the result of counting string occurrences in an array.
 */
export type TCountStringOccurrencesResult<T extends Array<string>> = {
	matches: Array<TStringOccurrences<T>>;
	total: number;
};

/**
 * Represents the occurrences of strings in an array.
 */
export type TStringOccurrences<T extends Array<string>> = {
	match: T[number];
	occurrences: number;
};

/**
 * Counts the occurrences of strings in an array.
 *
 * @template T - The type of the array.
 * @param values - The array of strings to count occurrences for.
 * @returns An object containing the matches and the total count of occurrences.
 */
export const countStringOccurrences = <T extends Array<string>>(
	values: T
): TCountStringOccurrencesResult<T> => {
	const matches = Object.values(
		values.reduce((acc: { [key: string]: TStringOccurrences<T> }, value: string) => {
			if (value in acc) acc[value].occurrences++;
			else acc[value] = { match: value, occurrences: 1 };

			return acc;
		}, {})
	);

	return { matches, total: matches.reduce((acc, { occurrences }) => acc + occurrences, 0) };
};

/**
 * Removes the 'score' property from an object of type T.
 * @template T - The type of the object.
 * @param {T} obj - The object from which to remove the 'score' property.
 * @returns {Omit<T, 'score'>} - The object without the 'score' property.
 */
export const removeScore = <T>({ score, ...rest }: T & { score: number }): T => rest as T;

/**
 * Highlights specified fields in an item by wrapping matching text with <mark> tags.
 * @param fields - The fields to highlight.
 * @param item - The item to highlight.
 * @param searchValues - An array of regular expressions to match.
 * @returns An object with the highlighted fields.
 */
export const highlightFields = <T>(
	fields: Array<Extract<keyof T, string>>,
	item: T,
	searchValues: Array<string | RegExp>
): Partial<T> =>
	fields.reduce((acc, field) => {
		let value = item[field] as string;
		for (const searchValue of searchValues)
			value = value.replaceAll(searchValue, (match: string) => `<mark>${match}</mark>`);

		return { ...acc, [field]: value };
	}, {});
