<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	$: ({ title, description, createdAt } = article);
</script>

<Card.Root class="hover:border-primary transition-colors">
	<Card.Header class="flex-row justify-between">
		<div class="flex flex-col space-y-1.5">
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</div>

		<div class="flex flex-col">
			<span>{createdAt}</span>
		</div>
	</Card.Header>
</Card.Root>
