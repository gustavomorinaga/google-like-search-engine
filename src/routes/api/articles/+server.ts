import { json } from '@sveltejs/kit';
import { SearchEngine, removeScore, sortByNewest, sortByOldest, sortByRelevance } from '$lib/utils';
import { DEFAULT_FIELDS_QUERY, DEFAULT_PROPS } from '$lib/config';
import type { TArticle, TQuery } from '$lib/ts';

const sortByMapping = {
	relevance: sortByRelevance,
	newest: sortByNewest,
	oldest: sortByOldest
} as const;

export const GET = async ({ fetch, url, setHeaders }) => {
	const searchTerm = url.searchParams.get('search') ?? DEFAULT_PROPS.query.search;
	const sortBy = (url.searchParams.get('sortBy') as TQuery['sortBy']) ?? DEFAULT_PROPS.query.sortBy;
	const selectedFields =
		(url.searchParams.get('fields')?.split(',') as Array<keyof TArticle>) ?? DEFAULT_FIELDS_QUERY;

	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.catch<Array<TArticle>>(() => []);

	const searchEngine = new SearchEngine(data, {
		fields: selectedFields as Array<keyof TArticle>,
		options: { highlight: Boolean(searchTerm) }
	});

	const result = await searchEngine
		.search(searchTerm)
		.then((res) => res.sort(sortByMapping[sortBy]).map(removeScore));

	// cache for 5 minutes
	setHeaders({
		'cache-control': 'public, max-age=300, s-max-age=300, stale-while-revalidate=300'
	});

	return json(result);
};
