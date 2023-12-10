<script lang="ts">
	import { CardArticle, FeedbackArticleNotFound } from '$lib/layouts';
	import type { TArticle } from '$lib/ts';

	export let articles: Array<TArticle>;

	$: hasArticles = articles.length > 0;
</script>

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

<style lang="postcss">
	ul {
		@apply flex max-h-[50dvh] scroll-px-16 flex-col gap-4
		overflow-auto scroll-smooth will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
	}
</style>
