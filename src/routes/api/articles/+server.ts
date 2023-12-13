import { json } from '@sveltejs/kit';
import { SearchEngine, sortByDate } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const GET = async ({ fetch, url, setHeaders }) => {
	const searchTerm = url.searchParams.get('search') ?? '';

	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((res) => res.sort(sortByDate));

	const searchEngine = new SearchEngine(data, {
		fields: ['title', 'description', 'content'],
		options: { highlight: Boolean(searchTerm) }
	});

	const result = await searchEngine.search(searchTerm);

	setHeaders({
		'cache-control': 'public, max-age=3600, s-max-age=3600, stale-while-revalidate=3600'
	});

	return json(result);
};
