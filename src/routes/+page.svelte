<script lang="ts">
	import { ViewArticlesList } from '$lib/layouts';
	import { getArticleState } from '$lib/stores';

	export let data;

	const state = getArticleState();
	$: if (data) $state = { ...$state, metadata: data.metadata, articles: data.articles };
</script>

<svelte:head>
	<title>Google-Like Search Engine</title>
	<meta
		name="description"
		content="Simple implementation of a Google-like search engine using TypeScript and SvelteKit"
	/>
</svelte:head>

<ViewArticlesList />
