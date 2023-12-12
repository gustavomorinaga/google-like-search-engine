<script lang="ts">
	import { browser } from '$app/environment';
	import { ViewArticle } from '$lib/layouts';
	import { sanitize } from '$lib/utils';

	export let data;
	const { article } = data;
	const sanitizedTitle = browser && sanitize(article.title);
</script>

<svelte:head>
	<title>{sanitizedTitle} | Google-Like Search Engine</title>
	<meta name="description" content={article.description} />
</svelte:head>

<ViewArticle {article} />
