import { redirect } from '@sveltejs/kit';
import { search } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, params: { slug } }) => {
	const fetchedArticle = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((articles) => articles.find((article) => article.slug === slug));

	if (!fetchedArticle) throw redirect(301, '/');

	const keywords = url.searchParams.get('keywords') ?? '';

	const [article] = await search({
		data: [fetchedArticle],
		fields: ['title', 'description', 'content'],
		term: keywords,
		options: { highlight: Boolean(keywords) }
	});

	return { article };
};
