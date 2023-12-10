<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { blur } from 'svelte/transition';
	import { Input } from '$lib/components/ui/input';
	import { CardArticle, FeedbackArticleNotFound } from '$lib/layouts';
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

	<div class="search-bar">
		<div class="prefix">🔍</div>

		<Input
			type="text"
			placeholder="Type to search a article..."
			class="pl-10"
			autofocus
			bind:value={searchTerm}
			on:input={handleSearch}
		/>

		{#if loading}
			<div class="loader" transition:blur>
				<span class="spinner">⏳</span>
				<span class="message">Loading...</span>
			</div>
		{/if}
	</div>

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

		& > div.search-bar {
			@apply relative mb-8;

			& > div.prefix {
				@apply absolute left-3 top-1/2 -translate-y-1/2 transform;
				@apply pointer-events-none text-muted-foreground;
			}

			& > div.loader {
				@apply absolute right-4 top-1/2 -translate-y-1/2 transform rounded-md bg-muted px-3;
				@apply pointer-events-none flex items-center gap-2;

				& > span.spinner {
					@apply origin-center animate-spin;
				}

				& > span.message {
					@apply text-sm text-muted-foreground;
				}
			}
		}

		& > ul {
			@apply flex max-h-[50dvh] scroll-px-16 flex-col gap-4
			overflow-auto scroll-smooth will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
		}
	}
</style>
