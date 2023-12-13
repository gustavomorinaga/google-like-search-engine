import type { TArticle } from '$lib/ts';

/**
 * Represents the fields of an article that can be included in a query.
 */
export type TArticleFields = Record<
	keyof Pick<TArticle, 'title' | 'description' | 'content'>,
	boolean
>;

/**
 * Represents a query object used for searching articles.
 */
export type TQuery = {
	search: string | null;
	sortBy: 'relevance' | 'newest' | 'oldest';
	fields: Array<keyof TArticle>;
};
