<script module lang="ts">
	import { onMount, setContext } from 'svelte';
	import type { Quiz } from '$lib/schemas/quiz';
	import { createStore, get } from 'idb-keyval';
	import { page } from '$app/state';
</script>

<script lang="ts">
	let { children } = $props();

	const quiz = $state<Quiz>(page.data.quiz);

	onMount(() => {
		if (quiz) return;
	});

	setContext('quiz', quiz);
</script>

{@render children()}
