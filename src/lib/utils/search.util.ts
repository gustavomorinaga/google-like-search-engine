/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Represents the search keywords for a search engine.
 */
type TSearchKeywords = {
	exact: Array<string>;
	partial: Array<string>;
	exclude: Array<string>;
};

/**
 * Represents the properties for performing a search operation.
 * @template T The type of data being searched.
 */
type TSearchProps<T> = {
	data: Array<T>;
	fields: Array<keyof T>;
	term?: string | null;
};

/**
 * Regular expression used for searching keywords in a search engine.
 * Matches words, phrases enclosed in double quotes, and optional plus/minus signs.
 */
const SEARCH_KEYWORDS_REGEX = /("[^"]+"|\+?\w+(-\w+)*|-?\w+)(?=\s|$)/g;

/**
 * Extracts search keywords from a given string.
 * @param value - The string to extract search keywords from.
 * @returns An object containing categorized search keywords.
 */
export const getSearchKeywords = (value?: string | null): TSearchKeywords => {
	if (!value) return { exact: [], partial: [], exclude: [] };

	const matchedRaw = value.matchAll(SEARCH_KEYWORDS_REGEX);
	const matchedValues = Array.from(matchedRaw).map(([keyword]) => keyword);

	return matchedValues.reduce<TSearchKeywords>(
		(acc, keyword) => {
			const isExact = keyword.startsWith('"') && keyword.endsWith('"');
			const isPartial = keyword.startsWith('+');
			const isExclude = keyword.startsWith('-');
			const isNormal = !isExact && !isPartial && !isExclude;

			if (isExact) acc.exact.push(keyword.slice(1, -1));
			if (isPartial) acc.partial.push(keyword.slice(1));
			if (isNormal) acc.partial.push(keyword);
			if (isExclude) acc.exclude.push(keyword.slice(1));

			return acc;
		},
		{ exact: [], partial: [], exclude: [] }
	);
};

/**
 * Performs a search operation based on the provided keywords, data, and fields.
 *
 * @template T - The type of the data array.
 * @param {TSearchProps<T>} options - The search options.
 * @returns {Array<T>} The filtered array of data items that match the search criteria.
 */
export const search = <T = Array<any>>({
	data,
	fields,
	term
}: TSearchProps<T>): Promise<Array<T>> =>
	new Promise((resolve) => {
		const { exact, partial, exclude } = getSearchKeywords(term);

		const hasExact = exact.length > 0;
		const hasPartial = partial.length > 0;
		const hasExclude = exclude.length > 0;

		// clone the data to avoid mutating the original data
		const clonedData = structuredClone(data);

		if (!hasExact && !hasPartial && !hasExclude) return resolve(clonedData);

		const exactRegex = new RegExp(exact.map((k) => `(?=.*\\b${k}\\b)`).join('|'), 'gi');
		const partialRegex = new RegExp(partial.map((k) => `(?=.*${k})`).join('|'), 'gi');
		const excludeRegex = new RegExp(exclude.map((k) => `(?=.*${k})`).join('|'), 'gi');

		const result = clonedData.filter((item) => {
			const fieldsToMatch = fields.map((field) => item[field]).join(' ');

			const isExactMatch = exactRegex.test(fieldsToMatch);
			const isPartialMatch = partialRegex.test(fieldsToMatch);
			const isExcludedMatch = excludeRegex.test(fieldsToMatch);

			if (hasExact && !isExactMatch) return false;
			if (hasPartial && !isPartialMatch) return false;
			if (hasExclude && isExcludedMatch) return false;

			return true;
		});

		return resolve(result);
	});
