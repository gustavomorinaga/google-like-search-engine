/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { notEmptyFilter, sortByScore } from '$lib/utils';

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
	fields: Array<keyof T>;
	term?: string | null;
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
	term
}: TSearchProps<T>): Promise<Array<T>> =>
	new Promise((resolve) => {
		const { normal, exact, partial, exclude } = getSearchKeywords(term);

		const hasNormal = normal.length > 0;
		const hasExact = exact.length > 0;
		const hasPartial = partial.length > 0;
		const hasExclude = exclude.length > 0;

		// clone the data to avoid mutating the original data
		const clonedData = structuredClone(data);

		if (!hasNormal && !hasExact && !hasPartial && !hasExclude) return resolve(clonedData);

		const emptyRegex = new RegExp('^$', 'gi');
		const normalRegex = new RegExp(`${normal.join('|')}`, 'gi');
		const exactRegex = new RegExp(`(?=.*${exact.join(')(?=.*')}).*$`, 'gi');
		const partialRegex = hasPartial
			? new RegExp(`(?:^|(?=[^']))(${partial.join('|')})`, 'gi')
			: emptyRegex;
		const excludeRegex = hasExclude
			? new RegExp(`(?:^|(?=[^']))(${exclude.join('|')})`, 'gi')
			: emptyRegex;

		const result = clonedData
			.map<TScored<T> | null>((item) => {
				const fieldsToMatch = fields.map((field) => item[field]).join(' ');

				const excludeResult = fieldsToMatch.match(excludeRegex);
				if (hasExclude && excludeResult) return null;

				const normalResult = fieldsToMatch.match(normalRegex);
				const exactResult = fieldsToMatch.match(exactRegex);
				const partialResult = fieldsToMatch.match(partialRegex);

				const normalCount = normalResult?.length ?? 0;
				const exactCount = exactResult?.length ?? 0;
				const partialCount = partialResult?.length ?? 0;

				if (hasNormal && !normalResult) return null;
				if (hasExact && !exactResult) return null;
				if (hasPartial && !partialResult) return null;

				let score = 0;
				if (normalCount) score += normalCount;
				if (exactCount) score += exactCount;
				if (partialCount) score += partialCount;

				return { ...item, score };
			})
			.filter(notEmptyFilter)
			.sort(sortByScore)
			.map(({ score, ...rest }) => rest as T);

		return resolve(result);
	});
