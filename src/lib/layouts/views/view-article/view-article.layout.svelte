<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { getArticleState } from '$lib/stores';
	import { ArrowLeft } from 'lucide-svelte';
	import type { TArticle } from '$lib/ts';

	const state = getArticleState();
	const article = $state.currentArticle as TArticle;

	const formattedCreatedAt = new Date(article.createdAt).toDateString();
	const formattedUpdatedAt = new Date(article.updatedAt).toDateString();
</script>

<article>
	<figure class="cover">
		<img src={article.cover} alt={article.description} />
	</figure>

	<Button size="sm" variant="outline" class="mb-8" href="/">
		<ArrowLeft class="w-4 h-4 mr-2" />
		Back to articles
	</Button>

	<header>
		<h1>{@html article.title}</h1>
		<p>{@html article.description}</p>

		<div class="info">
			<span>By {@html article.author}</span>
			<Separator orientation="vertical" class="h-6" />
			<span>Published at {formattedCreatedAt}</span>
			<Separator orientation="vertical" class="h-6" />
			<span>Updated at {formattedUpdatedAt}</span>
		</div>
	</header>

	<span class="content">{@html article.content}</span>
</article>

<style lang="postcss">
	article {
		@apply relative mt-[10dvh] block h-full;

		& > figure.cover {
			@apply absolute inset-x-0 top-0 -z-10 -mt-[12dvh] h-[15dvh] w-screen overflow-hidden opacity-40 grayscale;
			@apply after:absolute after:inset-0 after:z-0 after:bg-gradient-to-t after:from-background after:to-transparent;
			margin-left: calc(-50vw + 50%);

			& > img {
				@apply h-full w-full object-cover;
			}
		}

		& > header {
			@apply z-10 mb-8 border-b border-border;

			& > h1 {
				@apply mb-4 text-2xl font-bold md:text-4xl;
				text-wrap: balance;
			}

			& > p {
				@apply mb-4 text-lg text-muted-foreground md:text-2xl;
				text-wrap: balance;
			}

			& > div.info {
				@apply mb-2 flex flex-wrap items-center gap-2 text-sm md:text-base;
			}
		}

		& > span.content {
			@apply z-10 mb-8 block max-h-[58dvh] overflow-auto scroll-smooth
			will-change-scroll scrollbar-thin scrollbar-thumb-secondary;

			& :global(h2) {
				@apply mb-4 mt-8 text-2xl font-bold;
			}

			& :global(p) {
				@apply [&:not(:last-child)]:mb-4;
			}
		}
	}
</style>
