<script lang="ts">
	import { ViewArticlesList } from '$lib/layouts';

	export let data;
	$: ({ articles, elapsedTime } = data);
</script>

<svelte:head>
	<title>Google-Like Search Engine</title>
	<meta
		name="description"
		content="Simple implementation of a Google-like search engine using TypeScript and SvelteKit"
	/>
</svelte:head>

<ViewArticlesList {articles} {elapsedTime} />
