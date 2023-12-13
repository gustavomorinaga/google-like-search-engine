<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Filter } from 'lucide-svelte';
	import type { TArticleFields } from '$lib/ts';
	import type { ComponentProps } from 'svelte';

	type TFieldOptions = Array<{ label: string; value: keyof typeof FIELDS_DEFAULT }>;

	const FIELDS_DEFAULT: TArticleFields = {
		title: true,
		description: true,
		content: true
	} as const;
	const FIELDS_OPTIONS: TFieldOptions = [
		{ label: 'Title', value: 'title' },
		{ label: 'Description', value: 'description' },
		{ label: 'Content', value: 'content' }
	];

	export let selectedFields = FIELDS_DEFAULT;
	export let onSelectedFieldChange: ComponentProps<DropdownMenu.CheckboxItem>['onCheckedChange'];

	$: hasOnlyOneField = Object.values(selectedFields).filter(Boolean).length === 1;
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button size="icon" variant="outline" builders={[builder]}>
			<Filter class="w-4 h-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-56">
		<DropdownMenu.Label>Fields</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each FIELDS_OPTIONS as { label, value } (value)}
			<DropdownMenu.CheckboxItem
				bind:checked={selectedFields[value]}
				onCheckedChange={onSelectedFieldChange}
				disabled={hasOnlyOneField && selectedFields[value]}
			>
				{label}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
