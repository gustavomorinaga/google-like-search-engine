<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	const { title, description, content } = article;
</script>

<article>
	<Button size="sm" variant="ghost" class="mb-8" href="/">← Back to articles</Button>

	<header>
		<h1>{title}</h1>
		<p>{description}</p>
	</header>

	<p>{content}</p>
</article>

<style lang="postcss">
	article {
		@apply mt-[10dvh] block h-full;

		& > header {
			@apply mb-4;

			& > h1 {
				@apply mb-4 text-4xl font-bold;
			}

			& > p {
				@apply mb-8 text-muted-foreground;
			}
		}
	}
</style>
