<script lang="ts">
	import 'virtual:uno.css';
	import { Tooltip } from 'bits-ui';

	let { children } = $props();
</script>

<svelte:head>
	<title>Quizbe - Interactive learning in one space</title>
</svelte:head>

<Tooltip.Provider>
	{@render children?.()}
</Tooltip.Provider>
