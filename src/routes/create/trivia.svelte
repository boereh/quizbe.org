<script lang="ts">
	import Trash from '~icons/ph/trash';
	import Image from '~icons/ph/image';
	import Plus from '~icons/ph/plus';
	import { Tooltip } from 'bits-ui';
	import { useVocabulary } from './+page.svelte';
	import Button from '$lib/components/button.svelte';

	const DEFAULT_SLIDE: Slide = {
		question: '',
		answers: [],
		time: 20,
		select: 'single',
		points: 'standard',
		type: 'quiz',
		correct_answers: [],
	};

	const vocab = useVocabulary();
	let slide_elements = $state<HTMLDivElement[]>([]);
	let current_slide = $state(-1);
</script>

<div class="flex-1 flex">
	<div class="w-64 border-r border-zinc-200 flex flex-col max-h-full overflow-y-auto">
		<div class="p-4 space-y-8">
			{#each vocab.trivia.slides as slide, idx (idx)}
				<div bind:this={slide_elements[idx]} class="group">
					<div class="flex items-center gap-2 h-6 mb-1">
						<div class="capitalize flex gap-2 text-sm font-semibold text-zinc-600">
							<span>{idx + 1}</span>
							<span>{slide.type}</span>
						</div>

						<div class="flex-1"></div>

						<Tooltip.Root disabled={vocab.trivia.slides.length > 1}>
							<Tooltip.Trigger
								class={[
									'size-6 transition grid place-items-center rounded-md opacity-0',
									vocab.trivia.slides.length > 1
										? 'hover:(bg-zinc-200) group-hover:(opacity-100) cursor-pointer'
										: 'group-hover:(opacity-50) cursor-not-allowed',
								]}
								onclick={() => {
									if (vocab.trivia.slides.length === 1) return;
									vocab.trivia.slides.splice(idx, 1);
								}}
							>
								{#snippet child({ props })}
									<Button icon={Trash} ui={{ base: [] }} {...props} />
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content
								sideOffset={8}
								class={[
									'bg-zinc-500 text-white p-1 border border-zinc-200 rounded text-xs origin-(--bits-tooltip-content-transform-origin)',
								]}
							>
								Cannot delete your only slide.
							</Tooltip.Content>
						</Tooltip.Root>
					</div>

					<button
						aria-label="select quiz {idx + 1}"
						class={[
							'aspect-video border-2 rounded-md w-full transition flex flex-col p-2',
							current_slide === idx ? 'bg-white border-svelte' : 'bg-zinc-100 border-zinc-100',
						]}
						onclick={() => (current_slide = idx)}
					>
						<div class="truncate text-xs overflow-hidden">
							{slide?.term || 'Question'}
						</div>

						<div class="flex-1 grid place-items-center relative">
							{#if slide.media}
								<img class="max-h-full max-w-full h-2" src={slide.media} alt="slide media" />
							{:else}
								<div class="text-zinc-400 border border-dashed p-6 py-2 border-zinc-300">
									<Image />
								</div>
							{/if}

							<div
								class="absolute left-2 top-1/2 -translate-y-1/2 text-xs bg-zinc-200 size-6 grid place-items-center rounded-full opacity-50"
							>
								{slide.time}
							</div>
						</div>

						<div class="grid grid-cols-2 gap-1">
							{#each { length: 6 }, idx (idx)}
								<span class={['border border-zinc-200 h-2']}></span>
							{/each}
						</div>
					</button>
				</div>
			{/each}
		</div>

		<div class="sticky bottom-0 left-0 right-0 bg-white p-4">
			<button
				class={[
					'flex items-center px-4 justify-center border border-b-4 rounded-md h-10 gap-2 shadow transition-all cursor-pointer border-zinc-100 w-full',
					'hover:(border-b-2 shadow-black/5) active:(border-b-1 shadow-none)',
				]}
				onclick={async () => {
					quiz.slides.splice(current_slide + 1, 0, DEFAULT_SLIDE);
					current_slide = current_slide + 1;
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
