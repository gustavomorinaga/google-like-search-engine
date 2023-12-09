<script lang="ts">
	import { articlesJSON } from '$lib/db';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
</script>

<section id="articles">
	<header>
		<h1>Articles</h1>
		<p>These are some article examples. They are fetched from a JSON file.</p>
	</header>

	<Input type="text" class="mb-8" placeholder="Type to search a article..." />

	<ul>
		{#each articlesJSON as { title, description }}
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
			@apply flex max-h-[50dvh] flex-col gap-4 overflow-y-auto pb-8;
		}
	}
</style>
