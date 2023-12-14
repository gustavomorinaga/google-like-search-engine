<script lang="ts">
	import { DEFAULT_FIELDS_OBJECT, DEFAULT_PROPS } from '$lib/config';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Filter } from 'lucide-svelte';
	import type { TQuery } from '$lib/ts';
	import type { ComponentProps } from 'svelte';

	type TSortByOptions = Array<{ label: string; value: TQuery['sortBy'] }>;
	type TFieldOptions = Array<{ label: string; value: keyof typeof FIELDS_DEFAULT }>;

	const SORT_BY_DEFAULT = DEFAULT_PROPS.query.sortBy;
	const SORT_BY_OPTIONS: TSortByOptions = [
		{ label: 'Relevance', value: 'relevance' },
		{ label: 'Newest', value: 'newest' },
		{ label: 'Oldest', value: 'oldest' }
	] as const;

	const FIELDS_DEFAULT = DEFAULT_FIELDS_OBJECT;
	const FIELDS_OPTIONS: TFieldOptions = [
		{ label: 'Title', value: 'title' },
		{ label: 'Description', value: 'description' },
		{ label: 'Content', value: 'content' }
	];

	export let sortBy = SORT_BY_DEFAULT;
	export let selectedFields = FIELDS_DEFAULT;
	export let onSortByChange: ComponentProps<DropdownMenu.RadioGroup>['onValueChange'];
	export let onSelectedFieldChange: ComponentProps<DropdownMenu.CheckboxItem>['onCheckedChange'];

	$: hasOnlyOneField = Object.values(selectedFields).filter(Boolean).length === 1;
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button size="icon" variant="outline" builders={[builder]} title="Filters">
			<Filter class="w-4 h-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-56">
		<DropdownMenu.Label>Sort by</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup bind:value={sortBy} onValueChange={onSortByChange}>
			{#each SORT_BY_OPTIONS as { label, value } (value)}
				<DropdownMenu.RadioItem bind:value>
					{label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>

		<DropdownMenu.Separator />

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
