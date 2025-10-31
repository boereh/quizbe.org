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
	import { nanoid } from 'nanoid';

	const COLORS = [
		'bg-red-600',
		'bg-blue-600',
		'bg-yellow-600',
		'bg-green-600',
		'bg-cyan-600',
		'bg-purple-600',
	];

	const SHAPES = [Triangle, Square, Circle, Diamond, Pentagon, Heart];

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
		slides: [
			{
				question: '',
				answers: [],
				time: 20,
				select: 'single',
				points: 'standard',
				type: 'quiz',
				correct_answers: [],
			},
		],
	});
	let id = $state(nanoid());
	let current_slide = $state(0);
	let answers = $state(4);
</script>

<div class="w-vw h-vh flex flex-col">
	<div class="border-b border-zinc-200 p-4">
		<span class="text-svelte text-3xl font-black">Quizbe</span>
	</div>

	<div class="flex-1 flex overflow-hidden">
		<div class="w-64 border-r border-zinc-200 flex flex-col">
			<div class="flex-1"></div>

			<div></div>
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
							'border border-zinc-200 p-4 flex rounded-lg h-26 transition',
							has_answer ? COLORS[idx] : 'bg-white',
						]}
					>
						<div class="text-white p-2 rounded grid place-items-center {COLORS[idx]}">
							<Icon class="size-8" />
						</div>

						<input
							bind:value={quiz.slides[current_slide].answers[idx]}
							class={[
								'px-4 flex-1 outline-none focus:(placeholder:opacity-0)',
								has_answer ? 'text-white' : '',
							]}
							type="text"
							placeholder="Add answer {idx + 1}{idx > 1 ? ' (Optional)' : ''}"
						/>
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
