<script lang="ts">
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { HoverCardCreator } from '$lib/layouts';
	import type { TCreator } from '$lib/ts';

	const creator: Omit<TCreator, 'initials'> = {
		name: 'Gustavo Morinaga',
		username: 'gustavomorinaga',
		avatar: 'https://github.com/gustavomorinaga.png',
		bio: 'Software Engineer | TypeScript | JavaScript | Node.js | SvelteKit | Next.js | Angular | MongoDB',
		website: 'https://gustavomorinaga.dev/'
	};
	const initials: TCreator['initials'] = creator.name
		.split(' ')
		.map(([letter]) => letter)
		.join('');
</script>

<footer>
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
			<HoverCardCreator creator={{ ...creator, initials }} />
		</HoverCard.Content>
	</HoverCard.Root>
	© 2023
</footer>

<style lang="postcss">
	footer {
		@apply container border-t border-border py-4 text-center;
	}
</style>
