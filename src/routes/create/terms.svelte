<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Trash from '~icons/ph/trash';
	import Image from '~icons/ph/image';
	import MaskHappy from '~icons/ph/mask-happy';
	import FilmStrip from '~icons/ph/film-strip';
	import SpeakerHigh from '~icons/ph/speaker-high';
	import DotsSix from '~icons/ph/dots-six-vertical';
	import Copy from '~icons/ph/copy';
	import { useVocabulary } from './+page.svelte';
	import {
		draggable,
		BoundsFrom,
		bounds,
		position,
		axis,
		controls,
		ControlFrom,
		events,
		transform,
		disabled,
	} from '@neodrag/svelte';
	import { onMount } from 'svelte';

	const vocab = useVocabulary();
	let dragging = $state(-1);
	let containers = $state<HTMLDivElement[]>([]);
	let positions = $state<number[]>([]);
	let size = $state(0);
	let gap = $state(0);

	onMount(() => {
		positions = containers.map(() => 0);
		size = containers[0].getBoundingClientRect().height;
	});

	$effect(() => {
		if (vocab.terms.length < 2) return;
		const first = containers[0].getBoundingClientRect();
		const second = containers[1].getBoundingClientRect();

		gap = second.top - first.bottom;
	});

	$inspect(positions, size, gap);
</script>

<div class="flex-1 overflow-y-auto p-8 space-y-8 box-container w-full">
	{#each { length: vocab.terms.length }, idx (idx)}
		<div bind:this={containers[idx]} class="flex justify-center">
			<div
				class={[
					'bg-white border border-zinc-200 p-4 left-100 max-w-5xl w-full relative',
					dragging === idx ? 'z-5' : 'z-0 transition-all',
				]}
				{@attach draggable([
					bounds(BoundsFrom.selector('.box-container')),
					events({
						onDragEnd: () => (dragging = -1),
						onDrag: ({ rootNode, offset }) => {
							positions[idx] = offset.y;
							const cont_rects = containers.map((v) => v.getBoundingClientRect());
							const root_rect = rootNode.getBoundingClientRect();
						},
						onDragStart: () => (dragging = idx),
					}),
					axis('y'),
					controls({ allow: ControlFrom.selector('.handle') }),
					transform(({ rootNode, offset }) => {
						rootNode.style.transform = `translateY(${offset.y}px)`;
					}),
					disabled(vocab.terms.length < 2),
				])}
			>
				<div class="flex gap-2 max-w-full">
					<span>
						<DotsSix />
					</span>
					<Button
						icon={Copy}
						size="xs"
						title="Duplicate"
						onclick={() => vocab.terms.splice(idx + 1, 0, vocab.terms[idx])}
					/>

					<div class="flex-1"></div>

					<Button
						icon={Trash}
						size="xs"
						title="Delete"
						ui={{
							base: 'bg-red-50 text-red-500 border-red-200',
						}}
						onclick={() => {
							vocab.terms.splice(idx, 1);

							if (vocab.terms.length === 0) vocab.terms = [{ term: '' }];
						}}
					/>

					<Button
						icon={Copy}
						size="xs"
						title="Duplicate"
						onclick={() => vocab.terms.splice(idx + 1, 0, vocab.terms[idx])}
					/>
				</div>
			</div>
		</div>

		<!-- <div
				class="max-w-6xl w-full mx-auto group bg-white rounded-lg p-4 gap-4 transition-all flex relative shadow-lg shadow-black/1"
			>
				<div class="flex-1 flex flex-col pl-2">
					<div class="flex flex-col gap-1 h-10 relative">
						<span
							class="absolute text-xs top-0 -translate-y-1/2 left-0 bg-white text-zinc-400 opacity-0"
						>
							Term*
						</span>

						<input
							bind:value={vocab.terms[idx].term}
							class="outline-none border-zinc-200 rounded-md h-10"
							type="text"
							placeholder="Enter vocab term"
						/>
					</div>

					<hr class="my-2 border-zinc-200" />

					<div class="flex flex-col relative">
						<span
							class=" absolute text-xs top-0 -translate-y-1/2 left-2 bg-white px-2 text-zinc-400 opacity-0"
						>
							Definition
						</span>

						<textarea
							bind:value={vocab.terms[idx].def}
							class="flex-1 w-full outline-none resize-none rounded-md"
							placeholder="Enter vocab definition"
							rows="2"
						></textarea>
					</div>
				</div>

				<button
					class="h-30 aspect-square border border-dashed rounded-lg border-zinc-300 flex items-center justify-center flex-wrap gap-2 cursor-pointer text-zinc-400 hover:(text-zinc-600 border-zinc-500)"
				>
					{#each [Image, MaskHappy, FilmStrip, SpeakerHigh] as Icon, idx (idx)}
						<Icon />
					{/each}
				</button>

				<div
					class="absolute flex justify-center left-1/2 -top-6 px-6 gap-2 transition-all opacity-0 pointer-events-none group-hover:(-top-4 opacity-100 pointer-events-auto)"
				>
					<Button
						icon={Trash}
						size="sm"
						title="Delete"
						ui={{
							base: 'bg-red-50 text-red-500 border-red-200',
						}}
						onclick={() => {
							vocab.terms.splice(idx, 1);

							if (vocab.terms.length === 0) vocab.terms = [{ term: '' }];
						}}
					/>

					<Button
						icon={Copy}
						size="sm"
						title="Duplicate"
						onclick={() => vocab.terms.splice(idx + 1, 0, vocab.terms[idx])}
					/>
				</div>
			</div> -->
	{/each}

	<div class="grid place-items-center py-6">
		<Button
			onclick={() => {
				vocab.terms.push({
					term: '',
				});
			}}
		>
			Add a term
		</Button>
	</div>
</div>
