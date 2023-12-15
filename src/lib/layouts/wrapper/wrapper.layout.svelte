<main>
	<slot />
</main>

<style lang="postcss">
	main {
		@apply container flex flex-col py-4;
		height: calc(100dvh - 3.25rem - 1px); /** 3.25rem = 52px (footer) + 1px (border) */
	}
</style>
