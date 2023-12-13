import {
	startPerformance,
	endPerformance,
	clearPerformance,
	measurePerformance,
	sortByDate,
	SearchEngine,
	type TPerformanceMarkNames
} from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url }) => {
	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((res) => res.sort(sortByDate));

	const searchTerm = url.searchParams.get('search') ?? '';

	const performanceMarkNames: TPerformanceMarkNames = [
		`start-${searchTerm}`,
		`end-${searchTerm}`,
		`duration-${searchTerm}`
	];
	const [markNameStart, markNameEnd] = performanceMarkNames;

	let elapsedTime = 0;
	startPerformance(markNameStart);

	const articleSearchEngine = new SearchEngine(data, {
		fields: ['title', 'description', 'content'],
		options: { highlight: Boolean(searchTerm) }
	});

	const articles = await articleSearchEngine.search(searchTerm).finally(() => {
		endPerformance(markNameEnd);
		elapsedTime = measurePerformance(performanceMarkNames).duration;
		clearPerformance(performanceMarkNames);
	});

	return { articles, elapsedTime };
};
