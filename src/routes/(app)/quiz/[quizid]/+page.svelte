<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { type Quiz } from '$lib/schemas/quiz';
	import { watch } from 'runed';
	import { page } from '$app/state';
	import { saveQuiz, loadDeviceQuiz } from '$lib/storage';

	let quiz = $state<Quiz>();
	let loading = $state(true);

	watch(
		() => $state.snapshot(quiz),
		(v) => {
			if (loading || !v) return;
			saveQuiz(v);
		},
		{
			lazy: true,
		},
	);

	onMount(async () => {
		if (quiz) return (loading = false);
		quiz = (await loadDeviceQuiz(page.params.quizid)) || undefined;
		await tick();
		loading = false;
	});
</script>

what
