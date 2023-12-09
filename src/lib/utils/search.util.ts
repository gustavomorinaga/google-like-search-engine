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
	term: string;
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
export const getSearchKeywords = (value: string = ''): TSearchKeywords => {
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
export const search = <T = Array<any>>({ data, fields, term }: TSearchProps<T>): Array<T> => {
	const { exact, partial, exclude } = getSearchKeywords(term);

	const hasExact = exact.length > 0;
	const hasPartial = partial.length > 0;
	const hasExclude = exclude.length > 0;

	if (!hasExact && !hasPartial && !hasExclude) return data;

	/**
	 * Regular expression used for exact matching.
	 */
	const exactRegex = new RegExp(exact.join('|'), 'i');

	/**
	 * Regular expression used for partial matching.
	 */
	const partialRegex = new RegExp(partial.map((k) => `(?=.*${k})`).join(''), 'i');

	/**
	 * Regular expression used to exclude specific keywords from the search.
	 */
	const excludeRegex = new RegExp(exclude.map((k) => `(?=.*${k})`).join(''), 'i');

	const result = data.filter((item) => {
		const currentField = fields.map((field) => item[field]).join(' ');

		const isExactMatch = hasExact && exactRegex.test(currentField);
		const isPartialMatch = hasPartial && partialRegex.test(currentField);
		const isExcluded = hasExclude && excludeRegex.test(currentField);

		return (isExactMatch || isPartialMatch) && !isExcluded;
	});

	return result;
};
