<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	const { title, description } = article;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
</Card.Root>
