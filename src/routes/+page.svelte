<script lang="ts">
	import { articlesJSON as articles } from '$lib/db';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { debounce, search } from '$lib/utils';

	const DEBOUNCE_SEARCH_TIME = 500;

	let searchTerm = '';
	let filteredResult: typeof articles = articles;

	const searchDebounce = debounce(
		(term: string) => search({ data: articles, fields: ['title', 'description', 'content'], term }),
		DEBOUNCE_SEARCH_TIME
	);

	const handleSearch = async (term: string) => await searchDebounce(term);

	$: (async () => (filteredResult = await handleSearch(searchTerm)))();
</script>

<section id="articles">
	<header>
		<h1>Articles</h1>
		<p>These are some article examples. They are fetched from a JSON file.</p>
	</header>

	<Input
		bind:value={searchTerm}
		type="text"
		class="mb-8"
		placeholder="🔍 Type to search a article..."
	/>

	<ul>
		{#each filteredResult as { title, description }}
			<li>
				<Card.Root>
					<Card.Header>
						<Card.Title>{title}</Card.Title>
						<Card.Description>{description}</Card.Description>
					</Card.Header>
				</Card.Root>
			</li>
		{/each}
	</ul>
</section>

<style lang="postcss">
	section#articles {
		@apply my-auto block h-full;

		& > header {
			@apply mb-8;

			& > h1 {
				@apply mb-4 text-4xl font-bold;
			}
		}

		& > ul {
			@apply flex max-h-[50dvh] scroll-px-16 flex-col gap-4
			overflow-auto scroll-smooth will-change-scroll scrollbar-thin scrollbar-thumb-secondary;
		}
	}
</style>
