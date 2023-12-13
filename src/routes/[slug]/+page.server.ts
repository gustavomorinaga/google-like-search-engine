import { redirect } from '@sveltejs/kit';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, params: { slug }, setHeaders }) => {
	const article = await fetch(`/api/articles/${slug}?${url.searchParams.toString()}`);
	if (!article.ok) throw redirect(301, '/');

	setHeaders({
		'cache-control': article.headers.get('cache-control') ?? ''
	});

	return { article: article.json() as Promise<TArticle> };
};
