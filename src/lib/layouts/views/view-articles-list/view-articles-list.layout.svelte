<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		DialogInstructions,
		DropdownMenuFilters,
		InputSearchBar,
		ListArticles
	} from '$lib/layouts';
	import { debounce, filterActiveFields } from '$lib/utils';
	import { DEFAULT_FIELDS_OBJECT, DEFAULT_PROPS } from '$lib/config';
	import { getArticleState } from '$lib/stores';
	import type { TQuery } from '$lib/ts';

	const state = getArticleState();

	let { searchParams } = $page.url;
	let debouncing = false;
	let search = (searchParams.get('search') as TQuery['search']) ?? DEFAULT_PROPS.query.search;
	let sortBy = (searchParams.get('sortBy') as TQuery['sortBy']) ?? DEFAULT_PROPS.query.sortBy;
	let selectedFields = DEFAULT_FIELDS_OBJECT;

	$: elapsedTimeSeconds = $state.metadata.elapsedTime / 1000;

	const searchDebounce = debounce(async () => {
		debouncing = false;
		$state.loading = true;

		if (search) searchParams.set('search', search);
		else searchParams.delete('search');

		if (sortBy) searchParams.set('sortBy', sortBy);
		else searchParams.delete('sortBy');

		const activeFields = Object.keys(filterActiveFields(selectedFields)).join(',');
		if (activeFields) searchParams.set('fields', activeFields);
		else searchParams.delete('fields');

		return await handleUpdateSearchParams().finally(() => ($state.loading = false));
	}, DEFAULT_PROPS.ui.debounceTime);

	const handleSearch = async () => {
		debouncing = true;
		return await searchDebounce();
	};

	const handleUpdateSearchParams = async () =>
		await goto(`/?${searchParams.toString()}`, { invalidateAll: true });
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
			bind:search
			bind:debouncing
			on:input={handleSearch}
		/>

		<DropdownMenuFilters
			bind:sortBy
			bind:selectedFields
			onSortByChange={handleSearch}
			onSelectedFieldChange={handleSearch}
		/>

		<div class="ml-2">
			<DialogInstructions />
		</div>
	</div>

	<div class="benchmarks">
		<span>Approximately {$state.metadata.count} results</span>
		<span>({elapsedTimeSeconds.toFixed(3)} seconds)</span>
	</div>

	<ListArticles />
</section>

<style lang="postcss">
	section {
		@apply block h-full pt-4 md:pt-[10dvh];

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
