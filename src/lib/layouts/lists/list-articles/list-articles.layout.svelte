<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { Loader2 } from 'lucide-svelte';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { CardArticle, FeedbackArticleNotFound } from '$lib/layouts';
	import type { TArticle } from '$lib/ts';

	export let articles: Array<TArticle>;
	export let virtualItemsRef: Array<HTMLLIElement> = [];
	export let loading = false;
	let virtualListRef: HTMLDivElement;

	$: searchParams = $page.url.searchParams;
	$: hasArticles = articles.length > 0;
	$: virtualizer = createVirtualizer<HTMLDivElement, HTMLLIElement>({
		count: articles.length,
		getScrollElement: () => virtualListRef,
		estimateSize: () => 100,
		overscan: 5,
		scrollPaddingEnd: 8
	});
	$: items = $virtualizer.getVirtualItems();
	$: if (virtualItemsRef.length) virtualItemsRef.forEach((el) => $virtualizer.measureElement(el));
</script>

<div class="list">
	{#if loading}
		<div class="loader" transition:fade>
			<Loader2 class="text-primary w-16 h-16 animate-spin drop-shadow" />
		</div>
	{/if}

	{#if hasArticles}
		<div class="scroll-container" bind:this={virtualListRef}>
			<div class="scroll-wrapper" style="height: {$virtualizer.getTotalSize()}px;">
				<ul style="transform: translateY({items[0] ? items[0].start : 0}px);">
					{#each items as row, index (row.index)}
						{@const article = articles[row.index]}

						<li bind:this={virtualItemsRef[index]} data-index={row.index}>
							<a href="/{article.slug}?{searchParams.toString()}">
								<CardArticle {article} />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{:else}
		<FeedbackArticleNotFound />
	{/if}
</div>

<style lang="postcss">
	div.list {
		@apply relative -m-2 block p-2;

		& > div.loader {
			@apply absolute inset-0 z-10 grid place-items-center backdrop-blur-sm;
		}

		& > div.scroll-container {
			@apply w-full overflow-y-auto;
			@apply scroll-smooth will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
			contain: strict;
			height: calc(100dvh - 26rem - 1px); /** 3.25rem = 52px (footer) + 1px (border) */

			& > div.scroll-wrapper {
				@apply relative w-full;

				& ul {
					@apply absolute left-0 top-0 w-full;
					@apply flex scroll-px-16 flex-col gap-4;
				}
			}
		}
	}
</style>
