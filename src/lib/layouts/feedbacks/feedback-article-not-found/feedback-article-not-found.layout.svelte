<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';
</script>

<Alert.Root>
	<span class="absolute top-4 left-4">
		<AlertCircle class="w-6 h-6" />
	</span>
	<div class="ml-2">
		<Alert.Title>No articles found.</Alert.Title>
		<Alert.Description>Try to search for another article.</Alert.Description>
	</div>
</Alert.Root>
