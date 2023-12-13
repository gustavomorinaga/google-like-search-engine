<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Filter } from 'lucide-svelte';

	const FIELDS_OPTIONS = [
		{ label: 'Title', value: 'title' },
		{ label: 'Description', value: 'description' },
		{ label: 'Content', value: 'content' },
		{ label: 'Author', value: 'author' }
	];

	export let selectedFields: Record<(typeof FIELDS_OPTIONS)[number]['value'], boolean> = {
		title: true,
		description: true,
		content: true,
		author: true
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button size="icon" variant="outline" builders={[builder]}>
			<Filter class="w-4 h-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>Fields</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each FIELDS_OPTIONS as { label, value } (value)}
			<DropdownMenu.CheckboxItem bind:checked={selectedFields[value]}>
				{label}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
