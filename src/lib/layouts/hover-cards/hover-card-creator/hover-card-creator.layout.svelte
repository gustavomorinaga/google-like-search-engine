<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import type { TCreator } from '$lib/ts';

	export let creator: TCreator;
</script>

<div class="hover-card-creator">
	<Avatar.Root>
		<Avatar.Image src={creator.avatar} />
		<Avatar.Fallback>{creator.initials}</Avatar.Fallback>
	</Avatar.Root>
	<div>
		<h4>@{creator.username}</h4>
		<p>{creator.bio}</p>
	</div>
</div>

<style lang="postcss">
	div.hover-card-creator {
		@apply flex justify-between gap-4;

		& > div {
			@apply space-y-1;

			& > h4 {
				@apply text-sm font-semibold;
			}

			& > p {
				@apply text-xs;
			}
		}
	}
</style>
