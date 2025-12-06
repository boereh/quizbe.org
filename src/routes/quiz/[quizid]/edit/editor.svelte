<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { useQuiz } from '$lib/contexts';
	import Trash from '~icons/ph/trash';
	import FilePlus from '~icons/ph/file-plus';
	import Plus from '~icons/ph/plus';
	import Check from '~icons/ph/check';
	import { TextareaAutosize } from 'runed';

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

	new TextareaAutosize({
		element: () => editing_text_el,
		input: () => quiz.value?.questions[editing].text,
	});
</script>

<div
	class={[
		'fixed inset-0 top-12 transition bg-zinc-100 grid place-items-center',
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
								'p-2 border border-b-6 rounded-xl flex-1 h-48 flex flex-col gap-2',
								ANSWER_COLORS[idx],
							]}
						>
							<div class="flex gap-1">
								<Button
									size="xs"
									icon={Trash}
									ui={{ base: 'bg-red-50 border-red-200 text-red-600' }}
								/>
								<Button size="xs" icon={FilePlus} />

								<span class="flex-1"></span>

								<button
									class={[
										' size-6 rounded-full grid place-items-center border cursor-pointer',
										answer.correct
											? 'bg-green-500 text-white border-green-500'
											: ' opacity-50 bg-zinc-200 hover:opacity-60',
									]}
									onclick={() => (answer.correct = !answer.correct)}
								>
									<Check class="size-4" />
								</button>
							</div>

							<textarea bind:value={answer.text} class="resize-none text-center w-full flex-1"
							></textarea>
						</div>
					{/each}

					<Button
						size="sm"
						icon={Plus}
						onclick={() => question.answers.push({ correct: false, text: '', media: '' })}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>
