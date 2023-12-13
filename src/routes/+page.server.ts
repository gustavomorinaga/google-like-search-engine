import { sortByDate, PerformanceUtil, SearchEngine } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, setHeaders }) => {
	const data = await fetch(`${url.origin}/db/articles.data.json`)
		.then<Array<TArticle>>((res) => res.json())
		.then((res) => res.sort(sortByDate));

	const searchTerm = url.searchParams.get('search') ?? '';

	setHeaders({
		'Cache-Control': 'max-age=60, s-max-age=60, stale-while-revalidate=60, public'
	});

	const searchPerformance = new PerformanceUtil({
		start: `start-${searchTerm}`,
		end: `end-${searchTerm}`,
		duration: `duration-${searchTerm}`
	});

	const articleSearchEngine = new SearchEngine(data, {
		fields: ['title', 'description', 'content'],
		options: { highlight: Boolean(searchTerm) }
	});

	searchPerformance.startPerformance();

	const articles = await articleSearchEngine.search(searchTerm).finally(() => {
		searchPerformance.endPerformance();
		searchPerformance.measurePerformance();
		searchPerformance.clearPerformance();
	});

	return { articles, elapsedTime: searchPerformance.getElapsedTime() };
};
