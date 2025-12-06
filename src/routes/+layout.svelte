<script lang="ts">
	import 'virtual:uno.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Quizbe - Interactive learning in one space</title>
</svelte:head>

{@render children?.()}
