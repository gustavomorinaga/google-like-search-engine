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

	const articles = await fetch(`/api/articles?${url.searchParams.toString()}`).finally(() => {
		searchPerformance.endPerformance();
		searchPerformance.measurePerformance();
		searchPerformance.clearPerformance();
	});

	setHeaders({
		'cache-control': articles.headers.get('cache-control') ?? ''
	});

	return {
		articles: articles.json() as Promise<Array<TArticle>>,
		elapsedTime: searchPerformance.getElapsedTime()
	};
};
