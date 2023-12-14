import { error, json } from '@sveltejs/kit';
import { DEFAULT_FIELDS_QUERY } from '$lib/config';
import { SearchEngine, removeScore } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const GET = async ({ url, params: { slug }, setHeaders }) => {
	const keywords = url.searchParams.get('search') ?? '';
	const selectedFields =
		(url.searchParams.get('fields')?.split(',') as Array<keyof TArticle>) ?? DEFAULT_FIELDS_QUERY;

	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((articles) => articles.find((article) => article.slug === slug));

	if (!data) throw error(404, 'Not found');

	const searchEngine = new SearchEngine([data], {
		fields: selectedFields as Array<keyof TArticle>,
		options: { highlight: Boolean(keywords) }
	});

	const [article] = await searchEngine.search(keywords).then((res) => res.map(removeScore));

	// cache for 5 minutes
	setHeaders({
		'cache-control': 'public, max-age=300, s-max-age=300, stale-while-revalidate=300'
	});

	return json(article);
};
