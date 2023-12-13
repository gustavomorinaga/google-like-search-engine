<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		DialogInstructions,
		DropdownMenuFilters,
		InputSearchBar,
		ListArticles
	} from '$lib/layouts';
	import { debounce } from '$lib/utils';
	import type { TArticle, TArticleFields } from '$lib/ts';

	const DEBOUNCE_SEARCH_TIME = 700;

	export let articles: Array<TArticle>;
	export let elapsedTime: number;
	let loading = false;
	let searchParams = $page.url.searchParams;
	let searchTerm = searchParams.get('search') ?? '';
	let selectedFields: TArticleFields;

	$: elapsedTimeSeconds = elapsedTime / 1000;

	const filterDebounce = debounce(async (fields: TArticleFields) => {
		loading = true;

		const activeFields = Object.entries(fields)
			.filter(([, value]) => value)
			.map(([key]) => key)
			.join(',');

		if (activeFields) searchParams.set('fields', activeFields);
		else searchParams.delete('fields');

		const url = `/?${searchParams.toString()}`;
		await goto(url).finally(() => (loading = false));
	}, DEBOUNCE_SEARCH_TIME);

	const searchDebounce = debounce(async (term: string) => {
		loading = true;

		if (term) searchParams.set('search', term);
		else searchParams.delete('search');

		const url = `/?${searchParams.toString()}`;
		await goto(url).finally(() => (loading = false));
	}, DEBOUNCE_SEARCH_TIME);

	const handleSearch = async () => await searchDebounce(searchTerm);
	const handleFilter = async () => await filterDebounce(selectedFields);
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
			placeholder="Type to search a article..."
			bind:searchTerm
			bind:loading
			on:input={handleSearch}
		/>

		<DropdownMenuFilters bind:selectedFields onSelectedFieldChange={handleFilter} />

		<div class="ml-2">
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
				@apply mb-4 text-2xl font-bold md:text-4xl;
				text-wrap: balance;
			}

			& p {
				@apply text-muted-foreground md:text-lg;
				text-wrap: balance;
			}

			& a {
				@apply font-medium underline-offset-2 hover:underline;
			}
		}

		& > div.search {
			@apply flex items-center justify-stretch gap-2;
		}

		& > div.benchmarks {
			@apply mb-6 mt-2 text-right text-sm text-muted-foreground;
		}
	}
</style>
