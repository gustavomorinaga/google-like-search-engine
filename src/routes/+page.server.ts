import { search } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url }) => {
	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((res) => res.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));

	const searchTerm = url.searchParams.get('search') ?? '';

	return {
		articles: search({
			data,
			fields: ['title'],
			term: searchTerm
		})
	};
};
