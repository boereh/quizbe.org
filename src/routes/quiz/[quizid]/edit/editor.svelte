<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { useQuiz } from '$lib/contexts';
	import Trash from '~icons/ph/trash';
	import FilePlus from '~icons/ph/file-plus';
	import Plus from '~icons/ph/plus';
	import Check from '~icons/ph/check';
	import Play from '~icons/ph/play';
	import { TextareaAutosize } from 'runed';
	import type { Question } from '$lib/schemas/quiz';

	const ANSWER_COLORS = [
		'border-red-500', // bg-red-600
		'border-blue-500', // bg-blue-600
		'border-orange-500', // bg-orange-600
		'border-green-500', // bg-green-600
		'border-cyan-500', // bg-cyan-600
		'border-pink-500', // bg-pink-600
	];

	type Props = { editing: number };

	let { editing }: Props = $props();
	const quiz = useQuiz();
	let editing_text_el = $state<HTMLTextAreaElement>(null!);
	let answers_media_elements = $state<(HTMLMediaElement | HTMLAudioElement | HTMLImageElement)[]>(
		[],
	);

	if ('text' in (quiz.value?.questions[editing] || {})) {
		new TextareaAutosize({
			element: () => editing_text_el,
			input: () => {
				const question = quiz.value?.questions[editing];
				if (!question || !('text' in question)) return '';
				return question.text;
			},
		});
	}
</script>

<div
	class={[
		'fixed inset-0 z-5 top-12 transition bg-zinc-100 grid place-items-center',
		editing < 0 ? 'pointer-events-none opacity-0' : '',
	]}
>
	{#if quiz.value?.questions[editing]}
		{@const question = quiz.value.questions[editing]}

		<div
			class="bg-white border border-zinc-200 aspect-video p-4 w-full max-w-7xl rounded-xl flex flex-col gap-4"
		>
			{#if question.type === 'multiple'}
				<textarea
					bind:this={editing_text_el}
					bind:value={question.text}
					class="p-4 h-16 text-center text-2xl hover:bg-zinc-100 focus:(bg-zinc-100) transition resize-none rounded-lg"
					placeholder="Type question here"
				></textarea>

				<div class="flex-1"></div>

				<div class="flex gap-4 items-center">
					{#each question.answers as answer, idx (idx)}
						<div
							class={[
								'p-2 border border-b-6 rounded-xl flex-1 h-64 flex flex-col gap-2 group',
								ANSWER_COLORS[idx],
							]}
						>
							<div class="flex gap-2">
								<Button
									size="xs"
									icon={Trash}
									ui={{
										base: [
											'bg-red-50 border-red-200 text-red-600',
											question.answers.length < 3 && 'hidden',
										],
									}}
									onclick={() => question.answers.splice(idx, 1)}
								/>

								<Button
									size="xs"
									icon={FilePlus}
									onclick={() => {
										const input = document.createElement('input');
										input.type = 'file';
										input.setAttribute('accept', 'image/*,video/*,audio/*');
										input.addEventListener('change', () => {
											const file = input.files?.[0];
											if (!file) return;
											const reader = new FileReader();
											reader.onloadend = function () {
												if (!reader.result) return;
												console.log(reader.result);
												answer.media = reader.result.toString();
											};
											reader.readAsDataURL(file);
										});
										input.click();
									}}
								/>

								<span class="flex-1"></span>

								<button
									class={[
										'size-6 rounded-full grid place-items-center border cursor-pointer transition-all',
										answer.correct
											? 'bg-green-500 text-white border-green-500'
											: 'bg-zinc-50 border-zinc-200 opacity-0 pointer-events-none hover:bg-zinc-200 group-hover:(opacity-100 pointer-events-auto)',
									]}
									onclick={() => (answer.correct = !answer.correct)}
								>
									<Check class="size-4" />
								</button>
							</div>

							{#if answer.media.startsWith('data:image')}
								<img
									bind:this={answers_media_elements[idx]}
									src={answer.media}
									alt="answer's media"
								/>
							{:else if answer.media.startsWith('data:video')}
								<div class="relative">
									<video
										bind:this={answers_media_elements[idx]}
										src={answer.media}
										controls
										onclick={(e) => e.currentTarget.play()}
									>
										<track kind="captions" />
									</video>

									<button
										class="size-6 absolute right-1 bottom-1 bg-black/50 text-white text-xs rounded-full grid place-items-center backdrop-blur pointer-events-none"
									>
										<Play />
									</button>
								</div>
							{/if}

							<textarea
								bind:value={answer.text}
								class="resize-none text-center w-full flex-1 p-2"
								placeholder="Type answer here{idx > 1 ? ' (Optional)' : ''}"
							></textarea>
						</div>
					{/each}

					{#if question.answers.length < 5}
						<Button
							size="sm"
							icon={Plus}
							onclick={() => question.answers.push({ correct: false, text: '', media: '' })}
						/>
						<!-- <button
							class="flex items-center justify-center gap-2 border border-dashed border-zinc-200 h-48 rounded-xl transition cursor-pointer hover:(bg-zinc-200 border-solid)"
						>
							<Plus />

							Add answer
						</button> -->
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
