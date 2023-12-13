/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	normalRegex,
	exactRegex,
	partialRegex,
	excludeRegex,
	notEmptyFilter,
	sortByScore,
	specialCharRegex,
	countStringOccurrences,
	highlightFields
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
 * Represents the properties for performing a search operation.
 * @template T The type of data being searched.
 */
type TSearchProps<T> = {
	fields: Array<Extract<keyof T, string>>;
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
 * Represents a search engine that performs search operations on a given dataset.
 * @template T The type of the data items in the dataset.
 */
export class SearchEngine<T> {
	/**
	 * The dataset to perform search operations on.
	 */
	private data: Array<T>;

	/**
	 * The fields to search within the data items.
	 */
	private fields: Array<Extract<keyof T, string>>;

	/**
	 * Optional search options.
	 */
	private options?: { highlight?: boolean };

	/**
	 * The search term to be used for searching.
	 */
	private term?: string | null = null;

	/**
	 * Creates a new instance of the SearchEngine class.
	 * @param data The dataset to perform search operations on.
	 * @param fields The fields to search within the data items.
	 * @param options Optional search options.
	 */
	constructor(data: Array<T>, { fields, options }: TSearchProps<T>) {
		this.data = data;
		this.fields = fields;
		this.options = options;
	}

	/**
	 * Gets the sanitized search term by removing special characters and trimming whitespace.
	 */
	private get sanitizedTerm(): string {
		return this.term?.trim()?.replace(specialCharRegex, '') ?? '';
	}

	/**
	 * Gets the search keywords extracted from the sanitized search term.
	 */
	private get searchKeywords(): TSearchKeywords {
		return getSearchKeywords(this.sanitizedTerm);
	}

	/**
	 * Checks if there are normal search keywords.
	 */
	private get hasNormal(): boolean {
		return this.searchKeywords.normal.length > 0;
	}

	/**
	 * Checks if there are exact search keywords.
	 */
	private get hasExact(): boolean {
		return this.searchKeywords.exact.length > 0;
	}

	/**
	 * Checks if there are partial search keywords.
	 */
	private get hasPartial(): boolean {
		return this.searchKeywords.partial.length > 0;
	}

	/**
	 * Checks if there are exclude search keywords.
	 */
	private get hasExclude(): boolean {
		return this.searchKeywords.exclude.length > 0;
	}

	/**
	 * Gets the regular expression for normal search.
	 */
	private get normalSearchRegex(): RegExp {
		return normalRegex(this.searchKeywords.normal);
	}

	/**
	 * Gets the regular expression for exact search.
	 */
	private get exactSearchRegex(): RegExp {
		return exactRegex(this.searchKeywords.exact);
	}

	/**
	 * Gets the regular expression for partial search.
	 */
	private get partialSearchRegex(): RegExp {
		return partialRegex(this.searchKeywords.partial);
	}

	/**
	 * Gets the regular expression for exclude search.
	 */
	private get excludeSearchRegex(): RegExp {
		return excludeRegex(this.searchKeywords.exclude);
	}

	/**
	 * Gets the unique set of fields to search within the data items.
	 */
	private get setOfFields(): Array<Extract<keyof T, string>> {
		return [...new Set(this.fields)];
	}

	/**
	 * Counts the occurrences of a string in a regular expression match result.
	 * @param result The regular expression match result.
	 * @returns The count of occurrences.
	 */
	private countStringOccurrences(result: RegExpMatchArray) {
		return countStringOccurrences(result);
	}

	/**
	 * Highlights the fields in an item that match the search keywords.
	 * @param item The item to highlight the fields in.
	 * @param regexList The list of regular expressions to match against the fields.
	 * @returns The item with highlighted fields.
	 */
	private highlightFields(item: T, regexList: Array<RegExp>): Partial<T> {
		return highlightFields(this.setOfFields, item, regexList);
	}

	/**
	 * Filters out null or undefined items from the search result.
	 * @param item The item to filter.
	 * @returns True if the item is not null or undefined, false otherwise.
	 */
	private notEmptyFilter(item: TScored<T> | null): boolean {
		return notEmptyFilter(item);
	}

	/**
	 * Sorts the search result items by score in descending order.
	 * @param a The first item to compare.
	 * @param b The second item to compare.
	 * @returns A negative value if a should be sorted before b, a positive value if a should be sorted after b, or 0 if a and b are equal.
	 */
	private sortByScore(a: TScored<T>, b: TScored<T>): number {
		return sortByScore(a, b);
	}

	/**
	 * Performs a search operation on the dataset.
	 * @param term The search term to be used for searching.
	 * @returns A promise that resolves to an array of search result items.
	 */
	public async search(term?: string | null): Promise<Array<T>> {
		this.term = term;

		const clonedData = structuredClone(this.data);

		if (!this.hasNormal && !this.hasExact && !this.hasPartial && !this.hasExclude) {
			return clonedData;
		}

		const result = clonedData
			.map<TScored<T> | null>((item) => {
				const fieldsToMatch = this.setOfFields.map((field) => item[field]).join(' ');

				const excludeResult = fieldsToMatch.match(this.excludeSearchRegex);
				if (this.hasExclude && excludeResult) return null;

				const normalResult = fieldsToMatch.match(this.normalSearchRegex);
				if (this.hasNormal && !normalResult) return null;

				const exactResult = fieldsToMatch.match(this.exactSearchRegex);
				if (this.hasExact && !exactResult) return null;

				const partialResult = fieldsToMatch.match(this.partialSearchRegex);
				if (this.hasPartial && !partialResult) return null;

				let score = 0;

				if (normalResult) {
					const normalCount = normalResult?.length ?? 0;
					const normalOccurrences = this.countStringOccurrences(normalResult);
					if (normalCount) score += normalOccurrences.total * normalOccurrences.matches.length;
				}

				if (exactResult) {
					const exactCount = exactResult?.length ?? 0;
					const exactOccurrences = this.countStringOccurrences(exactResult);
					if (exactCount) score += exactOccurrences.total * exactOccurrences.matches.length;
				}

				if (partialResult) {
					const partialCount = partialResult?.length ?? 0;
					const partialOccurrences = this.countStringOccurrences(partialResult);
					if (partialCount) score += partialOccurrences.total * partialOccurrences.matches.length;
				}

				let mappedItem = { ...item, score };

				if (this.options?.highlight) {
					const highlightedFields = this.highlightFields(item, [
						this.normalSearchRegex,
						this.exactSearchRegex,
						this.partialSearchRegex
					]);

					mappedItem = { ...mappedItem, ...highlightedFields };
				}

				return mappedItem;
			})
			.filter(this.notEmptyFilter);

		return (result as Array<TScored<T>>)
			.sort(this.sortByScore)
			.map(({ score, ...rest }) => rest as T);
	}
}
