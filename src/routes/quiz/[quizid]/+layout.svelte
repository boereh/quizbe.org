<script module lang="ts">
	import { onMount, tick } from 'svelte';
	import { QUIZ_SCHEMA } from '$lib/schemas/quiz';
	import { useDebounce, watch } from 'runed';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { safeParse } from 'valibot';
	import { useQuizStorage } from '$lib/storage';
	import { setQuiz } from '$lib/contexts';
</script>

<script lang="ts">
	let { children } = $props();

	let quiz = $state<ReturnType<typeof setQuiz>>({
		value: page.data.quiz,
		loading: true,
	});

	const saveQuiz = useDebounce(async () => {
		const snapped = $state.snapshot(quiz).value;
		if (!snapped) return;
		if (snapped.local) return useQuizStorage().set(snapped.id, snapped);
	}, 500);

	watch(
		() => $state.snapshot(quiz),
		() => {
			if (quiz.loading) return;
			saveQuiz();
		},
		{
			lazy: true,
		},
	);

	onMount(async () => {
		if (quiz.value) return (quiz.loading = false);
		if (!page.params.quizid) return goto(resolve('/quiz'));

		const storage = useQuizStorage();
		const parsed = safeParse(QUIZ_SCHEMA, await storage.get(page.params.quizid));
		if (!parsed.success) return goto(resolve('/quiz'));

		quiz.value = parsed.output;
		await tick();
		quiz.loading = false;
	});

	setQuiz(quiz);
</script>

{@render children()}

<style>
	:global(body) {
		--at-apply: bg-zinc-100;
	}
</style>
