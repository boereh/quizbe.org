<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Tooltip } from 'bits-ui';
	import 'virtual:uno.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Quizbe - Interactive learning in one space</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<Tooltip.Provider>
	{@render children?.()}
</Tooltip.Provider>
