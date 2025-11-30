<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import 'virtual:uno.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Quizbe - Interactive learning in one space</title>
</svelte:head>

<Tooltip.Provider>
	{@render children?.()}
</Tooltip.Provider>
