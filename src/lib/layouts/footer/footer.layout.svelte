<script lang="ts">
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { HoverCardCreator } from '$lib/layouts';
	import type { TCreator } from '$lib/ts';

	const year = new Date().getFullYear();
	const creator: TCreator = {
		name: 'Gustavo Morinaga',
		username: 'gustavomorinaga',
		avatar: 'https://avatars.githubusercontent.com/u/47375774?v=4',
		bio: 'Software Engineer | TypeScript | JavaScript | Node.js | SvelteKit | Next.js | Angular | MongoDB',
		website: 'https://gustavomorinaga.dev/',
		initials: () =>
			creator.name
				.split(' ')
				.map(([letter]) => letter)
				.join('')
	};
</script>

<footer>
	<div>
		Developed with ❤ by
		<HoverCard.Root>
			<HoverCard.Trigger
				href={creator.website}
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold hover:underline underline-offset-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
			>
				@{creator.username}
			</HoverCard.Trigger>
			<HoverCard.Content side="top" sideOffset={24} class="w-80">
				<HoverCardCreator {creator} />
			</HoverCard.Content>
		</HoverCard.Root>
		© {year}
	</div>
</footer>

<style lang="postcss">
	footer {
		@apply relative z-10 mt-auto block border-t border-border bg-background;

		& > div {
			@apply container py-4 text-center text-sm;
			text-wrap: balance;
		}
	}
</style>
