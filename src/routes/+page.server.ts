import { search } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url }) => {
	const data = await fetch(`${url.origin}/db/articles.data.json`).then<Array<TArticle>>((res) =>
		res.json()
	);

	const articles = search({
		data,
		fields: ['title', 'description', 'content'],
		term: url.searchParams.get('search') ?? ''
	});

	return { articles };
};
