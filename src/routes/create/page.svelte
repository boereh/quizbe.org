<script lang="ts">
	import { Dialog, Tabs, Tooltip } from 'bits-ui';
	import Image from '~icons/ph/image';
	import MaskHappy from '~icons/ph/mask-happy';
	import FilmStrip from '~icons/ph/film-strip';
	import SpeakerHigh from '~icons/ph/speaker-high';
	import Diamond from '~icons/ph/diamond-fill';
	import Heart from '~icons/ph/heart-fill';
	import Plus from '~icons/ph/plus';
	import XIcon from '~icons/ph/x';
	import MathOperations from '~icons/ph/math-operations';
	import Trash from '~icons/ph/trash';
	import Star from '~icons/ph/star-fill';
	import Spade from '~icons/ph/spade-fill';
	import Sun from '~icons/ph/sun-fill';
	import Club from '~icons/ph/club-fill';
	import { nanoid } from 'nanoid';
	import 'mathlive';
	import type { MathfieldElement } from 'mathlive';
	import { on } from 'svelte/events';
	import { tick } from 'svelte';

	const TEST_MEDIA =
		'data:image/png;base64,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';
	const COLORS = [
		'bg-yellow-600',
		'bg-blue-600',
		'bg-green-600',
		'bg-red-600',
		'bg-orange-600',
		'bg-purple-600',
	];

	const SHAPES = [Star, Spade, Heart, Diamond, Club, Sun];
	const DEFAULT_SLIDE: Slide = {
		question: '',
		answers: [],
		time: 20,
		select: 'single',
		points: 'standard',
		type: 'quiz',
		correct_answers: [],
	};

	type Slide = {
		question?: string;
		media?: string;
		answers: string[];
		time: number;
		select: 'single' | 'multiple';
		points: false | 'standard' | 'double';
		type: 'quiz' | 'true-false';
		correct_answers: number[];
	};

	type Quiz = {
		title: string;
		background: string;
		slides: Slide[];
	};

	let quiz = $state<Quiz>({
		title: '',
		background: 'oklch(96.7% 0.001 286.375)',
		slides: [{ ...DEFAULT_SLIDE, media: TEST_MEDIA }],
	});
	let id = $state(nanoid());
	let current_slide = $state(0);
	let answers_length = $state(4);
	let slide_elements = $state<HTMLDivElement[]>([]);
	let mf_elements = $state<MathfieldElement[]>([]);
	let mf_modes = $state<MathfieldElement['mode'][]>([]);
	let mf_focused = $state<number[]>([]);

	function init(node: MathfieldElement, idx: number) {
		node.addEventListener('mode-change', () => {
			mf_modes[idx] = node.mode;
		});
		node.addEventListener('focus', () => (mf_focused[idx] = 1));
		node.addEventListener('blur', async () => {
			await tick();
			if (mf_focused[idx] === 2) return;
			mf_focused[idx] = 0;
		});

		$effect(() => {
			if (quiz.slides[current_slide]?.answers[idx]) {
				node.value = quiz.slides[current_slide].answers[idx];
			}
		});
		$effect(() => {
			return on(node, 'input', () => {
				quiz.slides[current_slide].answers[idx] = node.value;
			});
		});
		$effect(() => {
			return on(window, 'blur', (e) => {
				if (mf_elements.includes(e.target as MathfieldElement)) return;
				mf_focused[idx] = 0;
			});
		});
	}
</script>

<div class="w-vw h-vh flex flex-col">
	<div class="border-b border-zinc-200 p-4 flex">
		<span class="text-svelte text-3xl font-black w-60">Quizbe</span>

		<div class="relative">
			<input
				class="h-full border border-zinc-200 px-2 rounded outline-0"
				type="text"
				placeholder="Enter quiz title..."
			/>
		</div>
	</div>

	<div class="flex-1 flex overflow-hidden">
		<div
			class="flex-1 bg-zinc-100 p-8 space-y-8 overflow-y-auto"
			style:background={quiz.background}
		>
			<input
				bind:value={
					() => quiz.slides[current_slide]?.question,
					(v) => (quiz.slides[current_slide].question = v)
				}
				class="bg-white border border-zinc-200 rounded-md w-full text-center outline-none h-20 text-3xl transition-all focus:(placeholder:opacity-0)"
				type="text"
				placeholder="Start typing your question"
			/>

			{#if quiz.slides[current_slide]?.media}
				<div
					class="flex flex-col items-center justify-center mx-auto w-2xl h-xs rounded-2xl bg-white border border-zinc-200 transition-all"
				></div>
			{:else}
				<Dialog.Root>
					<Dialog.Trigger
						class="flex flex-col items-center justify-center mx-auto w-2xl h-xs rounded-2xl bg-white border border-b-8 border-zinc-200 shadow-lg cursor-pointer transition-all hover:(border-b-4 shadow-md) active:(border-b-1 shadow-none)"
					>
						<div class="flex gap-2 opacity-60">
							{#each [Image, MaskHappy, FilmStrip, SpeakerHigh] as Icon, idx (idx)}
								<Icon class="size-8" />
							{/each}
						</div>

						<p class="my-2 text-2xl">Find and insert media</p>
						<p class="text-xs text-zinc-500">drag or paste here to upload.</p>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay class="absolute inset-0 bg-black/25 backdrop-blur-xs" />
						<Dialog.Content
							class="absolute bg-white left-1/2 top-1/2 -translate-1/2 w-3xl rounded-lg "
						>
							<Tabs.Root>
								<Tabs.List>
									<Tabs.Trigger value="image">
										<Image class="size-8" />
									</Tabs.Trigger>
									<Tabs.Trigger value="giphy">
										<MaskHappy class="size-8" />
									</Tabs.Trigger>
									<Tabs.Trigger value="video">
										<FilmStrip class="size-8" />
									</Tabs.Trigger>
									<Tabs.Trigger value="speaker">
										<SpeakerHigh class="size-8" />
									</Tabs.Trigger>
								</Tabs.List>

								<Tabs.Content value="image">
									<Image class="size-8" />
								</Tabs.Content>
								<Tabs.Content value="giphy">
									<MaskHappy class="size-8" />
								</Tabs.Content>
								<Tabs.Content value="video">
									<FilmStrip class="size-8" />
								</Tabs.Content>
								<Tabs.Content value="speaker">
									<SpeakerHigh class="size-8" />
								</Tabs.Content>
							</Tabs.Root>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			{/if}

			<div class="grid grid-cols-2 gap-8">
				{#each { length: answers_length }, idx (idx)}
					{@const Icon = SHAPES[idx]}
					{@const answer = quiz.slides[current_slide]?.answers[idx]}
					{@const has_answer = answer && answer.length > 0}

					<div
						class={[
							'border border-zinc-200 p-4 flex rounded-lg h-26 transition relative',
							has_answer ? COLORS[idx] : 'bg-white',
						]}
					>
						<div
							class={[
								'left-1/2 -translate-x-1/2 -translate-y-full top-0 rounded-t-md px-6 pt-2 bg-white absolute border border-b-0 border-zinc-200 transition',
								mf_focused[idx] ? '' : 'opacity-0 transition-delay-200',
							]}
						>
							<div class="size-4 relative">
								<button
									class={[
										'absolute top-0 left-1/2 -translate-x-1/2 grid place-items-center border border-b-3 rounded-md size-7 shadow transition-all cursor-pointer',
										'hover:(border-b-2 shadow-black/5) active:(border-b-1 shadow-none)',
										!mf_modes[idx] || mf_modes[idx] === 'text'
											? 'bg-white border-zinc-200'
											: 'bg-svelte text-white border-svelte-600',
									]}
									onclick={() => {
										mf_focused[idx] = 2;
										mf_elements[idx].executeCommand([
											'switchMode',
											mf_elements[idx].mode === 'text' ? 'latex' : 'text',
										]);
									}}
								>
									<MathOperations class="size-4" />
								</button>
							</div>
						</div>

						<button
							class="text-white p-2 rounded grid place-items-center {COLORS[idx]}"
							onclick={() => {
								const index = quiz.slides[current_slide].correct_answers.findIndex(
									(v) => v === idx,
								);

								if (index < 0) quiz.slides[current_slide].correct_answers.push(idx);
								else quiz.slides[current_slide].correct_answers.splice(index, 0);
							}}
						>
							<Icon class="size-8" />
						</button>

						<math-field
							bind:this={mf_elements[idx]}
							use:init={idx}
							class={[
								'px-4 flex-1 outline-none cursor-text bg-transparent focus:(placeholder:opacity-0)',
								has_answer ? 'text-white' : '',
							]}
							default-mode="text"
							type="text"
							placeholder={`\\text{Add answer ${idx + 1}${idx > 1 ? ' (Optional)' : ''}}`}
						>
						</math-field>
						<!-- <input
							bind:value={quiz.slides[current_slide].answers[idx]}
							class={[
								'px-4 flex-1 outline-none focus:(placeholder:opacity-0)',
								has_answer ? 'text-white' : '',
							]}
							type="text"
							placeholder="Add answer {idx + 1}{idx > 1 ? ' (Optional)' : ''}"
						/> -->
					</div>
				{/each}

				<div class="col-span-2 grid place-items-center">
					<button
						class="flex items-center gap-2 bg-white border border-b-4 rounded-lg px-2 h-10 border-zinc-200 shadow-md transition-all cursor-pointer hover:(border-b-2 shadow) active:(border-b-1 shadow-none)"
						onclick={() => (answers_length = answers_length === 4 ? 6 : 4)}
					>
						{#if answers_length === 4}
							<Plus />

							Add more answers
						{:else}
							<XIcon />

							Remove additional answers
						{/if}
					</button>
				</div>
			</div>
		</div>

		<div></div>
	</div>
</div>

<style>
	math-field::part(menu-toggle),
	math-field::part(virtual-keyboard-toggle) {
		display: none;
	}

	math-field::part(ML__text) {
		font-family: var(--font-sans);
		font-weight: black;
	}

	math-field::part(placeholder),
	math-field::part(content) {
		--_text-highlight-background-color: transparent;
	}
</style>
