<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { CardArticle, FeedbackArticleNotFound } from '$lib/layouts';
	import type { TArticle } from '$lib/ts';

	export let articles: Array<TArticle>;
	let virtualListRef: HTMLDivElement;
	let virtualItemsRef: Array<HTMLLIElement> = [];

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

{#if hasArticles}
	<div class="scroll-container" bind:this={virtualListRef}>
		<div class="scroll-wrapper" style="height: {$virtualizer.getTotalSize()}px;">
			<ul style="transform: translateY({items[0] ? items[0].start : 0}px);">
				{#each items as row, index (row.index)}
					{@const article = articles[row.index]}

					<li bind:this={virtualItemsRef[index]} data-index={row.index}>
						<a href="/{article.slug}">
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

<style lang="postcss">
	div.scroll-container {
		@apply h-[50dvh] w-full overflow-y-auto;
		@apply scroll-smooth will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
		contain: strict;

		& > div.scroll-wrapper {
			@apply relative w-full;

			& ul {
				@apply absolute left-0 top-0 w-full;
				@apply flex scroll-px-16 flex-col gap-4;
			}
		}
	}
</style>
