import { error, json } from '@sveltejs/kit';
import { SearchEngine } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const GET = async ({ url, params: { slug }, setHeaders }) => {
	const keywords = url.searchParams.get('keywords') ?? '';

	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((articles) => articles.find((article) => article.slug === slug));

	if (!data) throw error(404, 'Not found');

	const searchEngine = new SearchEngine([data], {
		fields: ['title', 'description', 'content'],
		options: { highlight: Boolean(keywords) }
	});

	const [article] = await searchEngine.search(keywords);

	setHeaders({
		'cache-control': 'public, max-age=3600, s-max-age=3600, stale-while-revalidate=3600'
	});

	return json(article);
};
