import type { TArticle } from '$lib/ts';

/**
 * Represents the fields of an article that can be included in a query.
 */
export type TArticleFields = Record<keyof Pick<TArticle, 'title' | 'description' | 'content'>, boolean>;
