<script lang="ts">
	import { blur } from 'svelte/transition';
	import { Input } from '$lib/components/ui/input';

	export let searchTerm: string;
	export let loading: boolean;
	export let placeholder: string;
</script>

<div class="search-bar">
	<div class="prefix">🔍</div>

	<Input type="text" {placeholder} class="pl-10" autofocus bind:value={searchTerm} on:input />

	{#if loading}
		<div class="loader" transition:blur>
			<span class="spinner">⏳</span>
			<span class="message">Loading...</span>
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
			@apply absolute right-3 top-1/2 -translate-y-1/2 transform rounded-md bg-muted px-3;
			@apply pointer-events-none flex items-center gap-2;

			& > span.spinner {
				@apply origin-center animate-spin;
			}

			& > span.message {
				@apply text-sm text-muted-foreground;
			}
		}
	}
</style>
