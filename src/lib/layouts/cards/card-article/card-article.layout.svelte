<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight } from 'lucide-svelte';
	import type { TArticle } from '$lib/ts';

	export let article: TArticle;
	$: ({ title, description, createdAt } = article);
	$: formattedCreatedAt = new Date(createdAt).toLocaleDateString();
</script>

<Card.Root class="hover:border-primary transition-colors group">
	<Card.Header class="flex-row justify-between space-y-0">
		<div class="flex flex-col gap-2">
			<Card.Title tag="h2">{@html title}</Card.Title>
			<Card.Description>{@html description}</Card.Description>
		</div>

		<div class="flex flex-col gap-2">
			<span>{formattedCreatedAt}</span>
			<span
				class="-translate-x-4 group-hover:translate-x-0 transition opacity-0 group-hover:opacity-100 ml-auto my-auto"
			>
				<ArrowRight class="w-6 h-6 text-primary" />
			</span>
		</div>
	</Card.Header>
</Card.Root>
