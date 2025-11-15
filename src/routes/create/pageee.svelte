<script module lang="ts">
	import ListBullets from '~icons/ph/list-bullets';
	import GridNine from '~icons/ph/grid-nine-fill';
	import FlagCheckered from '~icons/ph/flag-checkered-fill';
	import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left-fill';
	import { getContext, setContext, type Component } from 'svelte';
	import Trivia from './trivia.svelte';
	import Jeopardy from './jeopardy.svelte';
	import Button from '$lib/components/button.svelte';
	import Terms from './terms.svelte';

	export type Mode = 'terms' | 'trivia' | 'jeopardy';

	export type Slide = {
		time: number;
		select: 'single' | 'multiple';
		points: false | 'standard' | 'double';
		type: 'quiz' | 'true-false';
		term: number;
		correct_answers: number[];
		exclude_answers: number[];
		shuffle_answers: boolean;
	};

	export type Term = {
		term: string;
		term_media?: string;
		def?: string;
		def_media?: string;
	};

	export type Vocabulary = {
		terms: Term[];
		trivia: {
			background: string;
			term_as_answers: false;
			time: number;
			select: 'single';
		};
		jeopardy: Record<string, []>;
		title: string;
		created: Date;
		updated: Date;
	};

	export const useVocabulary = () => getContext<Vocabulary>('vocabulary');
</script>

<script lang="ts">
	const MODES: Record<Mode, Component> = {
		terms: ListBullets,
		trivia: FlagCheckered,
		jeopardy: GridNine,
	};

	let current_mode = $state<Mode>('terms');
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
			slides: [
				{
					correct_answers: [],
					exclude_answers: [],
					points: 'standard',
					select: 'single',
					shuffle_answers: true,
					time: 30,
					type: 'quiz',
					term: 0,
				},
			],
		},
		jeopardy: {},
		title: '',
		created: new Date(),
		updated: new Date(),
	});

	setContext('vocabulary', vocabulary);
</script>

<div class="w-vw h-vh flex flex-col bg-zinc-100">
	{@render header()}

	<div class="flex-1 flex overflow-hidden">
		{#if current_mode === 'trivia'}
			<Trivia />
		{:else if current_mode === 'jeopardy'}
			<Jeopardy />
		{:else}
			<Terms />
		{/if}
	</div>
</div>

{#snippet header()}
	<div class="border-b border-zinc-200 bg-white p-4 gap-4 flex items-center z-30">
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

			<Button icon={ArrowElbowDownLeft} ui={{ base: 'bg-red-50 text-red-500 border-red-600' }}>
				Exit
			</Button>
		</div>
	</div>
{/snippet}
