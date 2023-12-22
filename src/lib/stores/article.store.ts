import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { TArticle } from '$lib/ts';

type TArticleState = {
	loading?: boolean;
	metadata: { count: number; elapsedTime: number };
	articles: Array<TArticle>;
	currentArticle?: TArticle;
};

const ARTICLE_CTX = 'ARTICLE_CTX';
const ARTICLE_INITIAL_STATE: TArticleState = {
	loading: false,
	metadata: { count: 0, elapsedTime: 0 },
	articles: [],
	currentArticle: undefined
};

export const setArticleState = (initialData: Partial<TArticleState> = ARTICLE_INITIAL_STATE) => {
	const articleState = writable(initialData);
	setContext(ARTICLE_CTX, articleState);

	return articleState;
};

export const getArticleState = () => getContext<Writable<TArticleState>>(ARTICLE_CTX);
