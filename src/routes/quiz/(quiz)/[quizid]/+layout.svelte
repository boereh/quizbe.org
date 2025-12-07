<script module lang="ts">
	import { onMount, setContext } from 'svelte';
	import { QUIZ_SCHEMA, type Quiz } from '$lib/schemas/quiz';
	import { createStore, get, set } from 'idb-keyval';
	import { useDebounce, watch } from 'runed';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { safeParse } from 'valibot';
</script>

<script lang="ts">
	let { children } = $props();

	let quiz = $state<{ value: Quiz }>({
		value: page.data.quiz,
	});

	onMount(async () => {
		if (quiz.value) return;
		if (!page.params.quizid) return goto(resolve('/quiz'));
		const result = await get(page.params.quizid, createStore('quizbe', 'quizzes'));
		const parsed = safeParse(QUIZ_SCHEMA, result);
		if (!parsed.success) return goto(resolve('/quiz'));
		quiz.value = parsed.output;
	});

	setContext('quiz', quiz);

	const saveQuiz = useDebounce(async () => {
		const quiz_snapped = $state.snapshot(quiz).value;

		if (quiz_snapped.local) {
			return set(quiz.value.id, quiz_snapped, createStore('quizbe', 'quizzes'));
		}
	}, 500);

	watch(
		() => $state.snapshot(quiz),
		() => {
			saveQuiz();
		},
		{
			lazy: true,
		},
	);
</script>

{@render children()}
