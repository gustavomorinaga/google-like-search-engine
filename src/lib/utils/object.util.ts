/**
 * Filters out inactive fields from an object.
 *
 * @template T - The type of the object.
 * @param {T} fields - The object containing fields to filter.
 * @returns {Partial<T>} - The object with only active fields.
 */
export const filterActiveFields = <T extends Record<string, boolean>>(fields: T): Partial<T> => {
	return Object.fromEntries(Object.entries(fields).filter(([, active]) => active)) as Partial<T>;
}
