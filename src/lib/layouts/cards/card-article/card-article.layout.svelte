<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	$: ({ title, description, createdAt } = article);
</script>

<Card.Root class="hover:border-primary transition-colors group">
	<Card.Header class="flex-row justify-between space-y-0">
		<div class="flex flex-col gap-2">
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</div>

		<div class="flex flex-col gap-2">
			<span>{new Date(createdAt).toLocaleDateString()}</span>
			<span
				class="text-lg ml-auto text-primary -translate-x-4 group-hover:translate-x-0 transition opacity-0 group-hover:opacity-100 -mt-2"
			>
				➞
			</span>
		</div>
	</Card.Header>
</Card.Root>
