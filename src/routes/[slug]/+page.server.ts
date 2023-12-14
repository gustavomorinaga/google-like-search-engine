import { redirect } from '@sveltejs/kit';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, params: { slug }, setHeaders }) => {
	const fetchedArticle = await fetch(`/api/articles/${slug}${url.search}`);
	if (!fetchedArticle.ok) throw redirect(301, '/');

	const article = (await fetchedArticle.json()) as TArticle;

	setHeaders({
		'cache-control': fetchedArticle.headers.get('cache-control') ?? ''
	});

	return { article };
};
