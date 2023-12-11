/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	emptyRegex,
	normalRegex,
	exactRegex,
	partialRegex,
	excludeRegex,
	notEmptyFilter,
	sortByScore,
	specialCharRegex
} from '$lib/utils';

/**
 * Represents the search keywords for a search engine.
 */
type TSearchKeywords = {
	normal: Array<string>;
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
	fields: Array<Extract<keyof T, string>>;
	term?: string | null;
	options?: {
		highlight?: boolean;
	};
};

/**
 * Represents a type that includes a score property.
 * @template T - The base type.
 */
type TScored<T> = T & { score: number };

/**
 * Regular expression used for searching keywords in a search engine.
 * Matches words, phrases enclosed in double quotes, optional plus/minus signs and include special characters.
 */
const SEARCH_KEYWORDS_REGEX = /(?:"[^"]*"|[^\s"]+)(?=\s*|\s*$)/g;

/**
 * Extracts search keywords from a given string.
 * @param value - The string to extract search keywords from.
 * @returns An object containing categorized search keywords.
 */
export const getSearchKeywords = (value?: string | null): TSearchKeywords => {
	const initialValue: TSearchKeywords = { normal: [], exact: [], partial: [], exclude: [] };

	if (!value) return initialValue;

	const matchedRaw = value.matchAll(SEARCH_KEYWORDS_REGEX);
	const matchedValues = Array.from(matchedRaw).map(([keyword]) => keyword);

	return matchedValues.reduce<TSearchKeywords>((acc, keyword) => {
		const isExact = keyword.startsWith('"') && keyword.endsWith('"');
		const isPartial = keyword.startsWith('+');
		const isExclude = keyword.startsWith('-');
		const isNormal = !isExact && !isPartial && !isExclude;

		// ignore keywords that only contain plus/minus signs
		if ([...keyword].every((char) => char === '+' || char === '-')) return acc;

		if (isExact) acc.exact.push(keyword.slice(1, -1));
		if (isPartial) acc.partial.push(keyword.slice(1));
		if (isExclude) acc.exclude.push(keyword.slice(1));
		if (isNormal) acc.normal.push(keyword);

		return acc;
	}, initialValue);
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
	term,
	options
}: TSearchProps<T>): Promise<Array<T>> =>
	new Promise((resolve) => {
		const sanitizedTerm = term?.trim()?.replace(specialCharRegex, '') ?? '';
		const { normal, exact, partial, exclude } = getSearchKeywords(sanitizedTerm);

		const hasNormal = normal.length > 0;
		const hasExact = exact.length > 0;
		const hasPartial = partial.length > 0;
		const hasExclude = exclude.length > 0;

		// clone the data to avoid mutating the original data
		const clonedData = structuredClone(data);

		if (!hasNormal && !hasExact && !hasPartial && !hasExclude) return resolve(clonedData);

		const normalSearchRegex = normalRegex(normal);
		const exactSearchRegex = exactRegex(exact);
		const partialSearchRegex = partialRegex(partial);
		const excludeSearchRegex = excludeRegex(exclude);

		const setOfFields = [...new Set(fields)];

		const result = clonedData
			.map<TScored<T> | null>((item) => {
				const fieldsToMatch = setOfFields.map((field) => item[field]).join(' ');

				const excludeResult = fieldsToMatch.match(excludeSearchRegex);
				if (hasExclude && excludeResult) return null;

				const normalResult = fieldsToMatch.match(normalSearchRegex);
				const exactResult = fieldsToMatch.match(exactSearchRegex);
				const partialResult = fieldsToMatch.match(partialSearchRegex);

				if (hasNormal && !normalResult) return null;
				if (hasExact && !exactResult) return null;
				if (hasPartial && !partialResult) return null;

				const normalCount = normalResult?.length ?? 0;
				const exactCount = exactResult?.length ?? 0;
				const partialCount = partialResult?.length ?? 0;

				let score = 0;
				if (normalCount) score += normalCount;
				if (exactCount) score += exactCount;
				if (partialCount) score += partialCount;

				let mappedItem = { ...item, score };

				if (options?.highlight) {
					const highlightedFields = setOfFields.reduce(
						(acc, field) => ({
							...acc,
							[field]: (item[field] as string)
								.replaceAll(normalSearchRegex, (match) => `<mark>${match}</mark>`)
								.replaceAll(exactSearchRegex, (match) => `<mark>${match}</mark>`)
								.replaceAll(partialSearchRegex, (match) => `<mark>${match}</mark>`)
						}),
						{}
					);

					mappedItem = { ...mappedItem, ...highlightedFields };
				}

				return mappedItem;
			})
			.filter(notEmptyFilter)
			.sort(sortByScore)
			.map(({ score, ...rest }) => rest as T);

		return resolve(result);
	});
