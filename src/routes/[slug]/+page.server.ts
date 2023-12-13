import { redirect } from '@sveltejs/kit';
import { SearchEngine } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, params: { slug } }) => {
	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((articles) => articles.find((article) => article.slug === slug));

	if (!data) throw redirect(301, '/');

	const keywords = url.searchParams.get('keywords') ?? '';

	const articleSearchEngine = new SearchEngine([data], {
		fields: ['title', 'description', 'content'],
		options: { highlight: Boolean(keywords) }
	});

	const [article] = await articleSearchEngine.search(keywords);

	return { article };
};
