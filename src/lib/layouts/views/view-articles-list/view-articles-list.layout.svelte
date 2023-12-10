<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { CardArticle, InputSearchBar, FeedbackArticleNotFound } from '$lib/layouts';
	import { debounce } from '$lib/utils';
	import type { TArticle } from '$lib/ts';

	const DEBOUNCE_SEARCH_TIME = 700;

	export let articles: Array<TArticle>;
	let searchTerm = $page.url.searchParams.get('search') ?? '';
	let loading = false;

	$: hasArticles = articles.length > 0;

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

	{#if hasArticles}
		<ul>
			{#each articles as article (article.id)}
				<li>
					<a href="/{article.slug}">
						<CardArticle {article} />
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<FeedbackArticleNotFound />
	{/if}
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

		& > ul {
			@apply flex max-h-[50dvh] scroll-px-16 flex-col gap-4
			overflow-auto scroll-smooth will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
		}
	}
</style>
