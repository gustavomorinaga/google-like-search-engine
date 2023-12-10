import {
	startPerformance,
	endPerformance,
	clearPerformance,
	measurePerformance,
	search,
	type TPerformanceMarkNames
} from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url }) => {
	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((res) => res.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));

	const searchTerm = url.searchParams.get('search') ?? '';

	const performanceMarkNames: TPerformanceMarkNames = {
		start: `start-${searchTerm}`,
		end: `end-${searchTerm}`,
		duration: `duration-${searchTerm}`
	};

	let elapsedTime = 0;
	startPerformance(performanceMarkNames.start);

	const articles = await search({
		data,
		fields: ['title', 'description', 'content'],
		term: searchTerm
	}).finally(() => {
		endPerformance(performanceMarkNames.end);
		elapsedTime = measurePerformance(performanceMarkNames).duration;
		clearPerformance(performanceMarkNames);
	});

	return { articles, elapsedTime };
};
