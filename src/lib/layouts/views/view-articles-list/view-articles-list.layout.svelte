<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { InputSearchBar, ListArticles } from '$lib/layouts';
	import { debounce } from '$lib/utils';
	import type { TArticle } from '$lib/ts';

	const DEBOUNCE_SEARCH_TIME = 700;

	export let articles: Array<TArticle>;
	export let elapsedTime: number;
	let searchTerm = $page.url.searchParams.get('search') ?? '';
	let loading = false;

	const searchDebounce = debounce(async (term: string) => {
		loading = true;

		await goto(`?search=${encodeURIComponent(term)}`);
		await invalidateAll().finally(() => (loading = false));
	}, DEBOUNCE_SEARCH_TIME);

	const handleSearch = async () => await searchDebounce(searchTerm);
</script>

<section>
	<header>
		<h1>Articles</h1>
		<p>These are some article examples. They are fetched from a JSON file.</p>
	</header>

	<InputSearchBar
		bind:searchTerm
		bind:loading
		placeholder="Type to search a article..."
		on:input={handleSearch}
	/>

	<div class="benchmarks">
		<span>Approximately {articles.length} results</span>
		<span>({elapsedTime.toFixed(3)} seconds)</span>
	</div>

	<ListArticles {articles} />
</section>

<style lang="postcss">
	section {
		@apply mt-[10dvh] block h-full;

		& > header {
			@apply mb-8;

			& > h1 {
				@apply mb-4 text-4xl font-bold;
			}
		}

		& > div.benchmarks {
			@apply mb-6 mt-2 text-right text-sm text-muted-foreground;
		}
	}
</style>
