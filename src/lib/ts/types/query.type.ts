import type { TArticle } from '$lib/ts';

export type TArticleFields = Record<keyof Pick<TArticle, 'title' | 'description' | 'content'>, boolean>;
