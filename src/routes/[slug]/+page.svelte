<script lang="ts">
	import { ViewArticle } from '$lib/layouts';

	export let data;
	const { article } = data;
</script>

<svelte:head>
	<title>{article.title}</title>
	<meta name="description" content={article.description} />
</svelte:head>

<ViewArticle {article} />
