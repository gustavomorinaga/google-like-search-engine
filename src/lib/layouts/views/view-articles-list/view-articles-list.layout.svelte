<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DialogInstructions, InputSearchBar, ListArticles } from '$lib/layouts';
	import { debounce } from '$lib/utils';
	import type { TArticle } from '$lib/ts';

	const DEBOUNCE_SEARCH_TIME = 700;

	export let articles: Array<TArticle>;
	export let elapsedTime: number;
	let searchTerm = $page.url.searchParams.get('search') ?? '';
	let loading = false;

	$: elapsedTimeSeconds = elapsedTime / 1000;

	const searchDebounce = debounce(async (term: string) => {
		loading = true;

		const searchParams = new URLSearchParams({ search: term });
		const url = '/' + (term && `?${searchParams.toString()}`);

		await goto(url).finally(() => {
			loading = false;
		});
	}, DEBOUNCE_SEARCH_TIME);

	const handleSearch = async () => await searchDebounce(searchTerm);

	// const handleHighlight = () => {
	// 	if (!searchTerm) return;
	// 	if (!virtualItemsRef.length) return;

	// 	const { normal, exact, partial } = getSearchKeywords(searchTerm);

	// 	for (const itemRef of virtualItemsRef) {
	// 		if (!itemRef) continue;

	// 		const alreadyHighlightedNormal = itemRef.innerHTML.match(highlightRegex(normal));
	// 		const alreadyHighlightedExact = itemRef.innerHTML.match(highlightRegex(exact));
	// 		const alreadyHighlightedPartial = itemRef.innerHTML.match(highlightRegex(partial));
	// 		if (alreadyHighlightedNormal || alreadyHighlightedExact || alreadyHighlightedPartial)
	// 			continue;

	// 		itemRef.innerHTML = itemRef.innerHTML
	// 			.replaceAll(normalRegex(normal), '<mark>$&</mark>')
	// 			.replaceAll(exactRegex(exact), '<mark>$&</mark>')
	// 			.replaceAll(partialRegex(partial), '<mark>$&</mark>');
	// 	}
	// };

	// const handleClearHighlight = () => {
	// 	console.log('limpando');
	// 	if (!virtualItemsRef.length) return;

	// 	const { normal, exact, partial } = getSearchKeywords(searchTerm);

	// 	for (const itemRef of virtualItemsRef) {
	// 		if (!itemRef) continue;

	// 		const alreadyCleanedNormal = !itemRef.innerHTML.match(highlightRegex(normal));
	// 		const alreadyCleanedExact = !itemRef.innerHTML.match(highlightRegex(exact));
	// 		const alreadyCleanedPartial = !itemRef.innerHTML.match(highlightRegex(partial));
	// 		if (alreadyCleanedNormal || alreadyCleanedExact || alreadyCleanedPartial) continue;

	// 		itemRef.innerHTML = itemRef.innerHTML
	// 			.replaceAll(highlightRegex(normal), '$&')
	// 			.replaceAll(highlightRegex(exact), '$&')
	// 			.replaceAll(highlightRegex(partial), '$&');
	// 	}
	// };
</script>

<section>
	<header>
		<div>
			<h1>Google-Like Search Engine</h1>
			<p>
				These are some article examples. They are fetched from
				<a
					href="{$page.url.origin}/db/articles.data.json"
					target="_blank"
					rel="noopener noreferrer"
				>
					this JSON file.
				</a>
				Checkout the
				<a
					href="https://github.com/gustavomorinaga/google-like-search-engine"
					target="_blank"
					rel="noopener noreferrer"
				>
					source code
				</a> for more details.
			</p>
		</div>
	</header>

	<div class="search">
		<InputSearchBar
			bind:searchTerm
			bind:loading
			placeholder="Type to search a article..."
			on:input={handleSearch}
		/>
		<div class="ml-auto">
			<DialogInstructions />
		</div>
	</div>

	<div class="benchmarks">
		<span>Approximately {articles.length} results</span>
		<span>({elapsedTimeSeconds.toFixed(3)} seconds)</span>
	</div>

	<ListArticles {articles} />
</section>

<style lang="postcss">
	section {
		@apply mt-4 block h-full md:mt-[10dvh];

		& > header {
			@apply mb-8 flex flex-wrap justify-between gap-x-16 gap-y-4 md:flex-nowrap;

			& h1 {
				@apply mb-4 text-4xl font-bold;
			}

			& p {
				@apply text-lg text-muted-foreground;
				text-wrap: balance;
			}

			& a {
				@apply font-medium underline-offset-2 hover:underline;
			}
		}

		& > div.search {
			@apply flex items-center justify-stretch gap-4;
		}

		& > div.benchmarks {
			@apply mb-6 mt-2 text-right text-sm text-muted-foreground;
		}
	}
</style>
