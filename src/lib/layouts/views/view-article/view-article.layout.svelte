<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	const { cover, title, description, author, createdAt, updatedAt, content } = article;
</script>

<article>
	<figure class="cover">
		<img src={cover} alt={description} />
	</figure>

	<Button size="sm" variant="outline" class="mb-8" href="/">
		<span class="text-lg mr-2">⭠</span>
		Back to articles
	</Button>

	<header>
		<h1>{title}</h1>
		<p>{description}</p>

		<div class="info">
			<span>By {author}</span>
			<Separator orientation="vertical" class="h-6" />
			<span>Published at {createdAt}</span>
			<Separator orientation="vertical" class="h-6" />
			<span>Updated at {updatedAt}</span>
		</div>
	</header>

	<span class="content">{@html content}</span>
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
			@apply z-10 mb-16;

			& > h1 {
				@apply mb-4 text-4xl font-bold;
			}

			& > p {
				@apply mb-4 text-2xl text-muted-foreground;
			}

			& > div.info {
				@apply inline-flex items-center gap-2;
			}
		}

		& > span.content {
			@apply z-10 block max-h-[50dvh] overflow-auto scroll-smooth
			will-change-scroll scrollbar-thin scrollbar-thumb-secondary;

			& :global(h2) {
				@apply mb-4 mt-8 text-2xl font-bold;
			}

			& :global(p) {
				@apply mb-4;
			}
		}
	}
</style>
