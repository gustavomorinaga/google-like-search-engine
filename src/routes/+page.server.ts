import { PerformanceUtil } from '$lib/utils';
import type { TArticle } from '$lib/ts';

export const load = async ({ fetch, url, setHeaders }) => {
	const searchTerm = url.searchParams.get('search') ?? '';

	const searchPerformance = new PerformanceUtil({
		start: `start-${searchTerm}`,
		end: `end-${searchTerm}`,
		duration: `duration-${searchTerm}`
	});

	searchPerformance.startPerformance();

	const fetchedArticles = await fetch(`/api/articles${url.search}`).finally(() => {
		searchPerformance.endPerformance();
		searchPerformance.measurePerformance();
		searchPerformance.clearPerformance();
	});

	const articles = (await fetchedArticles.json()) as Array<TArticle>;
	const elapsedTime = searchPerformance.getElapsedTime();

	setHeaders({
		'cache-control': fetchedArticles.headers.get('cache-control') ?? ''
	});

	return { articles, elapsedTime };
};
