/**
 * Checks if a value is not null or undefined.
 * @param value - The value to check.
 * @returns True if the value is not null or undefined, false otherwise.
 */
export const notEmptyFilter = <T>(value: T | null | undefined): value is T =>
	value !== null && value !== undefined;

/**
 * Sorts an array of objects by their createdAt property in descending order.
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @returns A negative number if a should be placed before b, a positive number if a should be placed after b, or 0 if they have the same createdAt value.
 */
export const sortByDate = <T extends { createdAt: string }>(a: T, b: T): number =>
	a.createdAt > b.createdAt ? -1 : 1;

/**
 * Sorts an array of objects by their score property in descending order.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @returns A negative number if `a` should be sorted before `b`, a positive number if `b` should be sorted before `a`, or 0 if they have the same score.
 */
export const sortByScore = <T extends { score: number }>(a: T, b: T): number =>
	a.score > b.score ? -1 : 1;
