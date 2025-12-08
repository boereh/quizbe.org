<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/button.svelte';
	import { QUIZ_SCHEMA, type Quiz } from '$lib/schemas/quiz';
	import { nanoid } from 'nanoid';
	import Plus from '~icons/ph/plus';
	import Sad from '~icons/ph/smiley-sad';
	import Rocket from '~icons/ph/rocket';
	import Copy from '~icons/ph/copy';
	import Trash from '~icons/ph/trash';
	import Link from '~icons/ph/link';
	import Pen from '~icons/ph/pen';
	import Calendar from '~icons/ph/calendar-dots';
	import ArrowsClockwise from '~icons/ph/arrows-clockwise';
	import List from '~icons/ph/list-numbers';
	import { useQuizStorage } from '$lib/storage';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { safeParse } from 'valibot';
	import dayjs from 'dayjs';
	import relative_time from 'dayjs/plugin/relativeTime';
	import { watch } from 'runed';

	dayjs.extend(relative_time);

	// const FILTERS = { Quizes: '', 'Shared with me': 'swm' };

	const quizzes = $state<Quiz[]>([]);
	let ignore_quizzes = $state(true);

	async function createQuiz() {
		const storage = useQuizStorage();
		const id = nanoid();
		if (await storage.has(id)) return createQuiz();

		await storage.set(id, {
			id,
			title: 'Untitled quiz',
			authors: [],
			questions: [],
			local: true,
			created: Date.now(),
			updated: Date.now(),
		});

		goto(resolve('/quiz/[quizid]/edit', { quizid: id }));
	}

	onMount(async () => {
		const storage = useQuizStorage();
		ignore_quizzes = true;

		for (const id of await storage.keys()) {
			const stored = await storage.get(id);
			const { success, output } = safeParse(QUIZ_SCHEMA, stored);
			if (!success) continue;
			quizzes.push(output);
		}
		await tick();
		ignore_quizzes = false;
	});

	watch(
		() => $state.snapshot(quizzes),
		(value, prev) => {
			if (ignore_quizzes) return;
			const storage = useQuizStorage();

			for (const quiz of value) {
				if (quiz.local) storage.set(quiz.id, quiz);
			}

			if (!prev) return;
			for (const quiz of prev) {
				if (value.findIndex((v) => v.id === quiz.id) >= 0) continue;
				storage.del(quiz.id);
			}
		},
		{ lazy: true },
	);
</script>

<div class="bg-white border-b border-zinc-200 sticky top-0 p-2 flex items-center gap-2">
	<span class="font-bold text-svelte text-2xl"> Quizbe </span>
	<span class="flex-1"></span>
</div>

<div class="p-4">
	<div class="max-w-7xl mx-auto space-y-4">
		<!-- <div class="flex gap-4"> -->
		<!-- {#each Object.entries(FILTERS) as [label, value] (label)}
				<Button
					{label}
					ui={{
						base: [
							filter === value
								? ''
								: ' border bg-white border-zinc-100 hover:(border bg-zinc-50) active:(border-0)',
						],
					}}
					onclick={() => (filter = value)}
				/>
			{/each} -->
		<!-- </div> -->

		{#if quizzes.length < 1}
			<div class="fixed inset-0 top-12 flex flex-col gap-4 items-center justify-center">
				<h1 class="text-4xl flex gap-2">
					<Sad />
					Oh naur!
				</h1>

				<p class="text-black/50 text-center">
					It seems we don’t have any quizzes created yet.
					<br />
					Let's kick off the interactive learning by creating a new quiz!
				</p>

				<br />

				<Button
					ui={{ base: 'bg-svelte-50 border-svelte-100 text-svelte-600' }}
					onclick={createQuiz}
				>
					<Plus />

					Create new quiz
				</Button>
			</div>
		{:else}
			<div class="max-w-7xl gap-4 grid md:grid-cols-2 xl:grid-cols-3">
				{#each quizzes as quiz, idx (idx)}
					<div class="max-w-7xl bg-white p-4 rounded-xl border border-zinc-200 flex flex-col gap-4">
						<div class="flex gap-2">
							<Button size="sm" icon={Rocket} label="Host" />
							<span class="flex-1"></span>
							<Button
								size="sm"
								icon={Pen}
								label="Edit"
								onclick={() => goto(resolve('/quiz/[quizid]/edit', { quizid: quiz.id }))}
							/>

							<Button
								size="sm"
								icon={Copy}
								onclick={() =>
									quizzes.splice(idx + 1, 0, {
										...quiz,
										title: quiz.title + ' Copy',
										updated: Date.now(),
										id: nanoid(),
									})}
							/>

							<Button size="sm" icon={Link} />

							<Button
								size="sm"
								icon={Trash}
								ui={{ base: 'bg-red-50 border-red-200 text-red-600' }}
								onclick={() => quizzes.splice(idx, 1)}
							/>
						</div>

						<h1 class="text-xl font-medium">
							{quiz.title}
						</h1>

						<div class="flex gap-4 justify-between items-center text-sm text-zinc-600">
							<span class="flex gap-2 items-center" title="Amount of Questions">
								<List class="size-4" />

								<span class="font-medium">
									{quiz.questions.length} questions
								</span>
							</span>
						</div>

						<div class="flex gap-4 justify-between items-center text-sm text-zinc-600">
							<span class="flex gap-2 items-center" title="Updated">
								<Calendar class="size-4" />

								<span class="font-medium">
									{dayjs(quiz.updated).fromNow()}
								</span>
							</span>

							<span class="flex gap-2 items-center" title="Created">
								<ArrowsClockwise class="size-4" />

								<span class="font-medium">
									{dayjs(quiz.created).fromNow()}
								</span>
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		--at-apply: bg-zinc-100;
	}
</style>
