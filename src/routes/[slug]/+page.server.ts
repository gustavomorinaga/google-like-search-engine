import { redirect } from '@sveltejs/kit';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, params: { slug } }) => {
	const article = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((articles) => articles.find((article) => article.slug === slug));

	if (!article) throw redirect(301, '/');

	return { article };
};
