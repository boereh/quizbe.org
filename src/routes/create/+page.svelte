<script lang="ts">
	import { Dialog, Tabs } from 'bits-ui';
	import Image from '~icons/ph/image';
	import MaskHappy from '~icons/ph/mask-happy';
	import FilmStrip from '~icons/ph/film-strip';
	import SpeakerHigh from '~icons/ph/speaker-high';
	import Triangle from '~icons/ph/triangle-fill';
	import Square from '~icons/ph/square-fill';
	import Circle from '~icons/ph/circle-fill';
	import Diamond from '~icons/ph/diamond-fill';
	import Pentagon from '~icons/ph/pentagon-fill';
	import Heart from '~icons/ph/heart-fill';
	import Plus from '~icons/ph/plus';
	import XIcon from '~icons/ph/x';
	import MathOperations from '~icons/ph/math-operations';
	import { nanoid } from 'nanoid';
	import 'mathlive';
	import type { MathfieldElement } from 'mathlive';
	import { on } from 'svelte/events';
	import { tick } from 'svelte';

	const COLORS = [
		'bg-red-600',
		'bg-blue-600',
		'bg-yellow-600',
		'bg-green-600',
		'bg-cyan-600',
		'bg-purple-600',
	];

	const SHAPES = [Triangle, Square, Circle, Diamond, Pentagon, Heart];
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
		slides: Slide[];
	};

	let quiz = $state<Quiz>({
		title: '',
		slides: [DEFAULT_SLIDE],
	});
	let id = $state(nanoid());
	let current_slide = $state(0);
	let answers = $state(4);
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
			if (quiz.slides[current_slide].answers[idx]) {
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
		<div class="w-64 border-r border-zinc-200 flex flex-col max-h-full">
			<div class="flex-1 overflow-y-auto p-4 space-y-8">
				{#each quiz.slides as slide, idx (idx)}
					<div bind:this={slide_elements[idx]}>
						<div class="capitalize flex gap-2 text-sm font-semibold text-zinc-600">
							<span>{idx + 1}</span>
							<span>{slide.type}</span>
						</div>

						<button
							aria-label="select quiz {idx + 1}"
							class={[
								'aspect-video border-2 rounded-md w-full',
								current_slide === idx ? 'bg-white border-svelte' : 'bg-zinc-100 border-zinc-100',
							]}
							onclick={() => (current_slide = idx)}
						></button>
					</div>
				{/each}

				<div class="sticky bottom-0 bg-white pt-4">
					<button
						class={[
							'flex items-center px-4 justify-center border border-b-4 rounded-md h-10 gap-2 shadow transition-all cursor-pointer border-zinc-200 w-full',
							'hover:(border-b-2 shadow-black/5) active:(border-b-1 shadow-none)',
						]}
						onclick={async () => {
							quiz.slides.splice(current_slide, 0, DEFAULT_SLIDE);
							current_slide++;
							await tick();
							slide_elements[current_slide].scrollIntoView({ behavior: 'smooth' });
						}}
					>
						<Plus />

						Add Slide
					</button>
				</div>
			</div>
		</div>

		<div class="flex-1 bg-zinc-100 p-8 space-y-8 overflow-y-auto">
			<input
				bind:value={quiz.slides[current_slide].question}
				class="bg-white border border-zinc-200 rounded-md w-full text-center outline-none h-20 text-3xl transition-all focus:(placeholder:opacity-0)"
				type="text"
				placeholder="Start typing your question"
			/>

			<Dialog.Root>
				<Dialog.Trigger
					class="flex flex-col items-center justify-center mx-auto w-lg h-xs rounded-2xl bg-white border border-b-8 border-zinc-200 shadow-lg cursor-pointer transition-all hover:(border-b-4 shadow-md) active:(border-b-1 shadow-none)"
				>
					<div class="flex gap-2 opacity-75">
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

			<div class="grid grid-cols-2 gap-8">
				{#each { length: answers }, idx (idx)}
					{@const Icon = SHAPES[idx]}
					{@const answer = quiz.slides[current_slide].answers[idx]}
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

						<div class="text-white p-2 rounded grid place-items-center {COLORS[idx]}">
							<Icon class="size-8" />
						</div>

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
						onclick={() => (answers = answers === 4 ? 6 : 4)}
					>
						{#if answers === 4}
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
