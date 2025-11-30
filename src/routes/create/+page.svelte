<script module lang="ts">
	import GridNine from '~icons/ph/dots-six-vertical';
	import Copy from '~icons/ph/copy';
	import Trash from '~icons/ph/trash';
	import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left-fill';
	import { getContext, onMount, setContext } from 'svelte';
	import Button from '$lib/components/button.svelte';
	import { nanoid } from 'nanoid';
	import { on } from 'svelte/events';
	import { flip } from 'svelte/animate';
	import { GridStack } from 'gridstack';

	export type BaseQuestion = { points: number; time: number };

	export type MultipleChoice = {
		type: 'multiple';
		points: number;
		time: number;
		text: string;
		image?: string;
		answers: Array<{ text?: string; image?: string; correct?: boolean }>;
	};

	export type Type = {
		type: 'type';
		points: number;
		time: number;
		answer: string;
	};

	export type Math = {
		type: 'math';
		points: number;
		time: number;
		text: string;
		image?: string;
		answer: string;
	};

	export type DragDrop = {
		type: 'dnd';
		points: number;
		time: number;
		image?: string;
		text: Array<{ text: string; correct?: boolean }[]>;
	};

	export type Categorize = {
		type: 'categorize';
		points: number;
		time: number;
		answers: Array<{ text?: string; image?: string; category: string }>;
	};

	export type Match = {
		type: 'match';
		points: number;
		time: number;
		text?: string;
		inorder: boolean;
		cards: Array<{ text: string; text_img: string; answer: string; answer_img: string }>;
	};

	export type TextOpenEnded = {
		type: 'draw' | 'audio';
		text: string;
	};

	export type Poll = {
		type: 'poll';
		text: string;
		choices: Array<{ text: string; image?: string }>;
	};

	export type Question = BaseQuestion &
		(MultipleChoice | Type | Math | DragDrop | Categorize | Match | TextOpenEnded | Poll);

	export type Quiz = {
		questions: Question[];
		title: string;
		id: string;
		created: Date;
		updated: Date;
	};

	export const useQuiz = () => getContext<Quiz>('quiz');
</script>

<script lang="ts">
	let quiz = $state<Quiz>({
		created: new Date(),
		id: nanoid(),
		questions: [
			{
				type: 'multiple',
				text: 'An exact location or position represented by a dot and named with a capital letter.',
				points: 1,
				time: 30,
				answers: [
					{ text: 'Point', correct: true },
					{ text: 'Line Segment' },
					{ text: 'Ray' },
					{ text: 'Line' },
				],
			},
			{
				type: 'multiple',
				text: 'Straight line that goes on forever in both directions.',
				points: 1,
				time: 30,
				answers: [
					{ text: 'Point' },
					{ text: 'Line Segment' },
					{ text: 'Ray' },
					{ text: 'Line', correct: true },
				],
			},
			{
				type: 'multiple',
				text: 'Formed when two rays share the same endpoint.',
				points: 1,
				time: 30,
				answers: [
					{ text: 'Point' },
					{ text: 'Line Segment' },
					{ text: 'Ray' },
					{ text: 'angle', correct: true },
				],
			},
			{
				type: 'multiple',
				text: 'What type of angle measures exactly 90 degrees?',
				points: 1,
				time: 30,
				answers: [
					{ text: 'Acute' },
					{ text: 'Obtuse' },
					{ text: 'Straight' },
					{ text: 'Right', correct: true },
				],
			},
		],
		title: '',
		updated: new Date(),
	});
	let containers = $state<HTMLDivElement[]>([]);
	let contents = $state<HTMLDivElement[]>([]);
	let dragging = $state(-1);
	let ignore = $state(-1);
	let mouse = $state(0);
	let start = $state(0);
	const animating = $state<Set<number>>(new Set());
	let gs: GridStack;

	setContext('quiz', quiz);

	onMount(() => on(window, 'mouseup', () => (dragging = -1)));
	onMount(() => on(window, 'mousemove', ({ y }) => (mouse = y)));

	$effect(() => {
		if (dragging < 0) return;

		containers.forEach((v, idx) => {
			const bounding = v.getBoundingClientRect();
			if (mouse < bounding.top || mouse > bounding.bottom) return;
			if (ignore === idx || animating.has(idx)) return;
			animating.add(idx);
			setTimeout(() => animating.delete(idx), 200);
			ignore = idx;

			const qa = quiz.questions[dragging];
			const qb = quiz.questions[idx];
			quiz.questions[dragging] = qb;
			quiz.questions[idx] = qa;

			dragging = idx;
			start = bounding.top;
		});
	});

	onMount(() => {
		gs = GridStack.init({
			column: 1,
			handle: '.handle',
		});
	});
</script>

<div class="w-vw h-vh flex flex-col bg-zinc-100">
	<div class="border-b border-zinc-200 bg-white p-4 gap-4 flex items-center z-30">
		<span class="text-svelte text-3xl font-black w-60">Quizbe</span>

		<div class="flex-1 flex items-center justify-center gap-8"></div>

		<div class="flex gap-4 flex items-center justify-end">
			<input
				class="border border-zinc-200 h-10 px-2 rounded outline-0 flex-1"
				type="text"
				placeholder="Enter quiz title..."
			/>

			<Button icon={ArrowElbowDownLeft} ui={{ base: 'bg-red-50 text-red-500 border-red-600' }}>
				Exit
			</Button>
		</div>
	</div>

	<div class="flex-1 overflow-y-auto quiz-container p-4">
		<div class="grid max-w-6xl mx-auto">
			{#each quiz.questions as question, idx (idx)}
				<div
					bind:this={containers[idx]}
					class={[dragging === idx ? 'z-5' : '']}
					animate:flip={{ duration: 200 }}
				>
					<div
						bind:this={contents[idx]}
						class={[
							'bg-white p-4 rounded border border-zinc-200 relative space-y-4',
							dragging === idx ? 'z-5' : 'transition-all transition',
						]}
						style:translate="0 {dragging === idx ? mouse - start : 0}px"
					>
						<div class="flex gap-2">
							<span class="size-4">
								{idx + 1}
							</span>

							<div class="flex-1"></div>

							<Button
								size="xs"
								icon={GridNine}
								onmousedown={() => {
									dragging = idx;
									start = mouse;
								}}
							/>

							<Button
								size="xs"
								icon={Copy}
								onclick={() => {
									quiz.questions.splice(idx + 1, 0, question);
								}}
							/>

							<Button
								size="xs"
								icon={Trash}
								ui={{ base: 'border-red-200 text-red-700 bg-red-50' }}
								onclick={() => {
									quiz.questions.splice(idx + 1, 0, question);
								}}
							/>
						</div>

						<div class="flex gap-8">
							<div class="flex-1">
								{question.type === 'multiple' ? question.text : ''}
							</div>

							{#if question.type === 'multiple'}
								<div class="grid grid-cols-2 gap-2 flex-1">
									{#each question.answers as answer, idx (idx)}
										<Button
											ui={{
												base: [answer.correct ? 'border-green-500 bg-green-400 text-white' : ''],
											}}
										>
											{typeof answer === 'string' ? answer : answer.text}
										</Button>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					{#if idx < quiz.questions.length - 1}
						<div
							class="hover:(opacity-100) opacity-0 transition duration-600 flex py-1 items-center gap-1"
						>
							<span class="flex-1 h-3px rounded-full bg-svelte"></span>
							<Button size="xs" ui={{ base: 'bg-svelte text-white border-svelte-600' }}>
								Add question
							</Button>

							<span class="flex-1 h-3px rounded-full bg-svelte"></span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
