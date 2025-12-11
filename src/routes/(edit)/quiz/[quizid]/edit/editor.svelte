<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import Trash from '~icons/ph/trash';
	import FilePlus from '~icons/ph/file-plus';
	import X from '~icons/ph/x';
	import Plus from '~icons/ph/plus';
	import Check from '~icons/ph/check';
	import Play from '~icons/ph/play';
	import Stop from '~icons/ph/stop';
	import { TextareaAutosize, watch } from 'runed';
	import type { Quiz } from '$lib/schemas/quiz';

	const ANSWER_COLORS = [
		'border-red-500', // bg-red-600
		'border-blue-500', // bg-blue-600
		'border-orange-500', // bg-orange-600
		'border-green-500', // bg-green-600
		'border-cyan-500', // bg-cyan-600
		'border-pink-500', // bg-pink-600
	];

	type Props = { editing: number; quiz?: Quiz };

	let { editing, quiz = $bindable() }: Props = $props();
	let editing_text_el = $state<HTMLTextAreaElement>(null!);
	let answers_media_element = $state<HTMLMediaElement[]>([]);
	let answers_media_playing = $state<boolean[]>([]);

	if ('text' in (quiz?.questions[editing] || {})) {
		new TextareaAutosize({
			element: () => editing_text_el,
			input: () => {
				const question = quiz?.questions[editing];
				if (!question || !('text' in question)) return '';
				return question.text;
			},
		});
	}

	watch(
		() => editing,
		(v) => {
			if (v >= 0) return;

			answers_media_element.forEach((e) => {
				e.pause();
				e.currentTime = 0;
			});
			answers_media_playing = answers_media_playing.map(() => false);
		},
	);
</script>

<div
	class={[
		'fixed inset-0 z-5 top-12 transition bg-zinc-100 grid place-items-center',
		editing < 0 ? 'pointer-events-none opacity-0' : '',
	]}
>
	{#if quiz?.questions[editing]}
		{@const question = quiz.questions[editing]}

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

				<div class="flex-1 grid place-items-center">
					<Button icon={FilePlus} label="Add media" />
				</div>

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

								{#if !answer.media}
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
								{/if}

								<span class="flex-1"></span>

								{#if answer.text.length > 0 || answer.media.length > 0}
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
								{/if}
							</div>

							{#if answer.media}
								<div class="aspect-video grid place-items-center group relative">
									{#if answer.media.startsWith('data:image')}
										<img src={answer.media} alt="answer's media" />
									{:else if answer.media.startsWith('data:video')}
										<video
											bind:this={answers_media_element[idx]}
											src={answer.media}
											onended={() => (answers_media_playing[idx] = false)}
										>
											<track kind="captions" />
										</video>
									{:else if answer.media.startsWith('data:audio')}
										<div>
											<audio
												bind:this={answers_media_element[idx]}
												src={answer.media}
												onended={() => (answers_media_playing[idx] = false)}
											></audio>
										</div>
									{/if}

									<div
										class="absolute h-full w-full pointer-events-none bg-linear-to-b from-black/50 via-transparent opacity-0 transition group-hover:(opacity-100)"
									>
										<div class="flex gap-1 p-1 pointer-events-auto">
											{#if answer.media.startsWith('data:video') || answer.media.startsWith('data:audio')}
												<button
													class="size-6 bg-black/50 text-white text-xs rounded-full grid place-items-center backdrop-blur cursor-pointer"
													onclick={() => {
														if (!answers_media_playing[idx]) {
															answers_media_playing[idx] = true;

															return answers_media_element[idx].play();
														}

														answers_media_playing[idx] = false;
														answers_media_element[idx].pause();
														answers_media_element[idx].currentTime = 0;
													}}
												>
													{#if answers_media_playing[idx]}
														<Stop />
													{:else}
														<Play />
													{/if}
												</button>
											{/if}

											<span class="flex-1"></span>

											<button
												class="size-6 bg-red-500/50 text-white text-xs rounded-full grid place-items-center backdrop-blur cursor-pointer"
												onclick={() => (answer.media = '')}
											>
												<X />
											</button>
										</div>
									</div>
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
