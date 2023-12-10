<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	const { title, description, author, createdAt, updatedAt, content } = article;
</script>

<article>
	<Button size="sm" variant="ghost" class="mb-8" href="/">
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

	<span>{@html content}</span>
</article>

<style lang="postcss">
	article {
		@apply mt-[10dvh] block h-full;

		& > header {
			@apply mb-8;

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

		& > span {
			@apply block max-h-[50dvh] overflow-auto scroll-smooth
			will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
		}
	}
</style>
