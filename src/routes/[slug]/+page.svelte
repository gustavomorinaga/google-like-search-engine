<script lang="ts">
	import { ViewArticle } from '$lib/layouts';

	export let data;
	const { article } = data;
</script>

<ViewArticle {article} />
