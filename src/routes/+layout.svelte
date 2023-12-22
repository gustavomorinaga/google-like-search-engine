<script>
	import '../app.pcss';
	import { Wrapper, Footer } from '$lib/layouts';
	import { setArticleState } from '$lib/stores';

	setArticleState();
</script>

<Wrapper>
	<slot />
</Wrapper>

<Footer />
