<script lang="ts">
	import { ViewArticle } from '$lib/layouts';
	import { getArticleState } from '$lib/stores';
	import { sanitize } from '$lib/utils';

	export let data;
	const { article } = data;

	const title = sanitize(article.title);
	const description = article.description;

	const state = getArticleState();
	$state.currentArticle = article;
</script>

<svelte:head>
	<title>{title} | Google-Like Search Engine</title>
	<meta name="description" content={description} />
</svelte:head>

<ViewArticle />
