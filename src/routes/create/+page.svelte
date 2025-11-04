<script lang="ts">
	import Plus from '~icons/ph/plus';
	import ListBullets from '~icons/ph/list-bullets';
	import GridNine from '~icons/ph/grid-nine-fill';
	import FlagCheckered from '~icons/ph/flag-checkered-fill';
	import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left-fill';
	import FloppyDisk from '~icons/ph/floppy-disk-fill';
	import Trash from '~icons/ph/trash';
	import Dots6Vertical from '~icons/ph/dots-six-vertical-bold';
	import Image from '~icons/ph/image';
	import MaskHappy from '~icons/ph/mask-happy';
	import FilmStrip from '~icons/ph/film-strip';
	import SpeakerHigh from '~icons/ph/speaker-high';
	import { onMount, tick, type Component } from 'svelte';
	import Trivia from './trivia.svelte';
	import Jeopardy from './jeopardy.svelte';
	import Button from '$lib/components/button.svelte';
	import { on } from 'svelte/events';

	const MODES: Record<Mode, Component> = {
		terms: ListBullets,
		trivia: FlagCheckered,
		jeopardy: GridNine,
	};

	type Mode = 'terms' | 'trivia' | 'jeopardy';

	type Slide = {
		time: number;
		select: 'single' | 'multiple';
		points: false | 'standard' | 'double';
		type: 'quiz' | 'true-false';
		correct_answers: number[];
		exclude_answers: string[];
	};

	type Trivia = {
		background: string;
		slides: Slide[];
	};

	type Jeopardy = Record<string, []>;

	type Term = {
		term: string;
		term_media?: string;
		def?: string;
		def_media?: string;
	};

	type Vocabulary = {
		terms: Term[];
		trivia: Trivia;
		jeopardy: Jeopardy;
		title: string;
		created: Date;
		updated: Date;
	};

	let vocabulary = $state<Vocabulary>({
		terms: [
			{
				term: 'Right angle',
				def: 'An angle that measures exactly 90 degrees.',
			},
			{
				term: 'Point',
				def: 'An exact location or position represented by a dot and named with a capital letter.',
			},
			{
				term: 'Line',
				def: 'Straight line that goes on forever in both directions.',
			},
			{
				term: 'Angle',
				def: 'Formed when two rays share the same endpoint.',
			},
		],
		trivia: {
			background: 'oklch(96.7% 0.001 286.375)',
			slides: [],
		},
		jeopardy: {},
		title: '',
		created: new Date(),
		updated: new Date(),
	});
	let current_mode = $state<Mode>('terms');
	let dragging_term = $state(-1);
	let mouse_pos = $state(0);
	let drag_start = $state(0);
	let vocab_containers = $state<HTMLDivElement[]>([]);
	let vocab_contents = $state<HTMLDivElement[]>([]);
	let vocab_pos_size = $state<{ y: number; h: number }[]>([]);
	let offset = $state<number>(0);
	let gap = $state(0);

	const resolveOffset = $derived((idx: number) => {
		if (dragging_term < 0) return 0;
		if (dragging_term === idx) return mouse_pos - drag_start;
		if (offset === 0) return 0;
		if (offset > 0 && idx > 0 && offset + dragging_term >= idx)
			return vocab_pos_size[idx - 1].y - vocab_pos_size[idx].y;
		if (offset) return 0;
	});

	onMount(() => {
		on(window, 'mouseup', async () => {
			if (offset > 0) {
				vocabulary.terms.splice(dragging_term + offset + 1, 0, vocabulary.terms[dragging_term]);
				vocabulary.terms.splice(dragging_term, 1);
			}
			await tick();
			dragging_term = -1;
		});

		on(window, 'mousemove', ({ y }) => {
			mouse_pos = y;

			if (dragging_term < 0) return;
			if (vocabulary.terms.length < 2) return;

			vocab_pos_size.forEach(function (el, i) {
				if (mouse_pos < el.y) return;
				if (mouse_pos > el.h + el.y) return;

				offset = i - dragging_term;
			});
		});
	});
</script>

<div class="w-vw h-vh flex flex-col">
	<div class="border-b border-zinc-200 p-4 gap-4 flex items-center">
		<span class="text-svelte text-3xl font-black w-60">Quizbe</span>

		<div class="flex-1 flex items-center justify-center gap-8">
			{#each Object.entries(MODES) as [mode, Icon] (mode)}
				<button
					class={[
						'capitalize flex gap-1 items-center cursor-pointer',
						current_mode === mode ? '' : 'text-zinc-500',
					]}
					onclick={() => (current_mode = mode as Mode)}
				>
					<Icon />

					<span>
						{mode}
					</span>
				</button>
			{/each}
		</div>

		<div class="flex gap-4 flex items-center justify-end">
			<input
				class="border border-zinc-200 h-10 px-2 rounded outline-0 flex-1"
				type="text"
				placeholder="Enter vocabulary title..."
			/>

			<Button icon={ArrowElbowDownLeft} ui={{ base: 'bg-red-500 text-white border-red-600' }}>
				Exit
			</Button>
		</div>
	</div>

	<div class="flex-1 flex overflow-hidden bg-zinc-100">
		{#if current_mode === 'trivia'}
			<Trivia />
		{:else if current_mode === 'jeopardy'}
			<Jeopardy />
		{:else}
			<div class="flex-1 overflow-y-auto p-8">
				<div class="grid">
					{#each vocabulary.terms as term, idx (idx)}
						<div
							bind:this={vocab_containers[idx]}
							class={[
								'max-w-6xl w-full mx-auto h-48 relative group',
								dragging_term >= 0 ? 'border-svelte' : '',
							]}
						>
							<div class="w-full h-full border border-dashed border-svelte rounded-xl"></div>

							<div
								bind:this={vocab_contents[idx]}
								class={[
									'absolute bg-white rounded-lg p-4 gap-4 h-full w-full transition-all flex border border-zinc-200 shadow-lg',
									dragging_term === idx ? 'z-20 duration-0' : '',
									offset === 0 ? '' : 'duration-0',
								]}
								style:top="{resolveOffset(idx)}px"
							>
								<div class="flex-1 flex flex-col gap-4">
									<div class="flex flex-col gap-1 h-10 relative">
										<span
											class=" absolute text-xs top-0 -translate-y-1/2 left-2 bg-white px-2 text-zinc-400"
										>
											Term
										</span>

										<input
											bind:value={vocabulary.terms[idx].term}
											class="outline-none border border-zinc-200 rounded-md h-10 px-2"
											type="text"
											placeholder="Enter vocab term"
										/>
									</div>

									<div class="flex flex-1 flex-col relative">
										<span
											class=" absolute text-xs top-0 -translate-y-1/2 left-2 bg-white px-2 text-zinc-400"
										>
											Definition
										</span>

										<textarea
											bind:value={vocabulary.terms[idx].def}
											class="flex-1 w-full outline-none resize-none border border-zinc-200 p-2 px-2 rounded-md"
											placeholder="Enter vocab definition"
										></textarea>
									</div>
								</div>

								<button
									class="h-full aspect-square border border-dashed rounded-lg border-zinc-300 flex items-center justify-center flex-wrap p-12 gap-2 cursor-pointer text-zinc-400 hover:(text-zinc-600 border-zinc-500)"
								>
									{#each [Image, MaskHappy, FilmStrip, SpeakerHigh] as Icon, idx (idx)}
										<Icon />
									{/each}
								</button>

								<div class="flex flex-col gap-4">
									<button
										class="cursor-ns-resize size-8 rounded-md grid place-items-center bg-zinc-50"
										onmousedown={() => {
											dragging_term = idx;
											drag_start = mouse_pos;
											for (const [i, el] of vocab_contents.entries()) {
												if (!vocab_pos_size[i]) vocab_pos_size[i] = { h: 0, y: 0 };
												const rect = el.getBoundingClientRect();
												vocab_pos_size[i].h = rect.height;
												vocab_pos_size[i].y = rect.top;
											}
											gap = vocab_pos_size[1].y - (vocab_pos_size[0].h + vocab_pos_size[0].y);
										}}
									>
										<Dots6Vertical />
									</button>

									<Button
										icon={Trash}
										size="sm"
										ui={{
											base: 'text-white bg-red-500 border-red-700 transition opacity-0 pointer-events-none group-hover:(opacity-100 pointer-events-auto)',
										}}
									></Button>
								</div>
							</div>
						</div>

						{#if idx < vocabulary.terms.length - 1}
							<div class="group min-h-8 h-8 relative flex justify-center items-center">
								<Button
									size="sm"
									ui={{
										base: [
											dragging_term >= 0
												? 'pointer-events-none opacity-0'
												: 'pointer-events-none opacity-0 group-hover:(opacity-100 pointer-events-auto)',
										],
									}}
									icon={Plus}
									onclick={() => {
										vocabulary.terms.splice(idx + 1, 0, {
											term: '',
										});
									}}
								/>
							</div>
						{/if}
					{/each}

					<div class="grid place-items-center py-8">
						<Button
							onclick={() => {
								vocabulary.terms.push({
									term: '',
								});
							}}
						>
							Add a term
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
