<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Input } from '$lib/components/ui/input';
	import { Loader2, Search } from 'lucide-svelte';

	export let search: string | null;
	export let debouncing: boolean = false;
	export let placeholder: string;
</script>

<div class="search-bar">
	<div class="prefix">
		<Search class="h-4 w-4" />
	</div>

	<Input type="text" {placeholder} class="pl-10" autofocus bind:value={search} on:input />

	{#if debouncing}
		<div class="loader" transition:fade>
			<Loader2 class="text-primary w-6 h-6 animate-spin" />
		</div>
	{/if}
</div>

<style lang="postcss">
	div.search-bar {
		@apply relative grow;

		& > div.prefix {
			@apply absolute left-3 top-1/2 -translate-y-1/2 transform;
			@apply pointer-events-none text-muted-foreground;
		}

		& > div.loader {
			@apply absolute right-3 top-1/2 -translate-y-1/2 transform;
			@apply pointer-events-none flex items-center gap-2;
		}
	}
</style>
