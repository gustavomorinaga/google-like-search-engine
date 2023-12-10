<script lang="ts">
	import { ViewArticlesList } from '$lib/layouts';

	export let data;
	$: ({ articles } = data);
</script>

<svelte:head>
	<title>Articles</title>
	<meta name="description" content="A list of articles" />
</svelte:head>

<ViewArticlesList {articles} />
