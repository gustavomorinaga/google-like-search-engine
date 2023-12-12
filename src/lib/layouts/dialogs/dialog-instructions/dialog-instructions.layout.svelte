<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { HelpCircle } from 'lucide-svelte';

	const instructions = [
		'Make a normal search, eg. important travel',
		'Search with operator "+" (plus) to match words, eg. +important +travel',
		'Search with operator "-" (minus) to exclude words, eg. important -travel',
		'Search with operator "" (double quotes) to match exact phrases, eg. "important travel"'
	];

	let dialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })} title="Instructions">
		<HelpCircle class="h-6 w-6" />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md md:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Instructions</Dialog.Title>
		</Dialog.Header>

		<div>
			<ul class="list-disc list-inside">
				{#each instructions as instruction}
					<li class="text-muted-foreground">
						{instruction}
					</li>
				{/each}
			</ul>
		</div>

		<Dialog.Footer>
			<Button autofocus on:click={() => (dialogOpen = false)}>Okay, thanks!</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
