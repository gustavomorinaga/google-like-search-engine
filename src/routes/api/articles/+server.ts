import { json } from '@sveltejs/kit';
import { SearchEngine, sortByDate } from '$lib/utils';
import type { TArticle } from '$lib/ts';

const DEFAULT_FIELDS: Array<keyof TArticle> = ['title', 'description', 'content'];

export const GET = async ({ fetch, url, setHeaders }) => {
	const searchTerm = url.searchParams.get('search') ?? '';
	const selectedFields = url.searchParams.get('fields')?.split(',') ?? DEFAULT_FIELDS;

	console.log(selectedFields);

	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((res) => res.sort(sortByDate));

	const searchEngine = new SearchEngine(data, {
		fields: selectedFields as Array<keyof TArticle>,
		options: { highlight: Boolean(searchTerm) }
	});

	const result = await searchEngine.search(searchTerm);

	// cache for 5 minutes
	setHeaders({
		'cache-control': 'public, max-age=300, s-max-age=300, stale-while-revalidate=300'
	});

	return json(result);
};
