<script lang="ts">
	import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left';
	import Gear from '~icons/ph/gear';
	import Trash from '~icons/ph/trash';
	import Pen from '~icons/ph/pen';
	import Copy from '~icons/ph/copy';
	import X from '~icons/ph/x';
	import Check from '~icons/ph/check';
	import DotsSixVertical from '~icons/ph/dots-six-vertical';
	import Button from '$lib/components/button.svelte';
	import { Dialog } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import {
		BLANK_QUESTIONS,
		ICONS_OF_QUESTION_TYPES,
		TIMELIMIT_KEYS_QUESTION,
		TIMELIMIT_QUESTION,
		TYPE_OF_QUESTIONS,
		type Question,
		type Quiz,
	} from '$lib/schemas/quiz';
	import Editor from './editor.svelte';
	import NoQuestions from './no-questions.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SelectSingle from '$lib/components/select-single.svelte';
	import { onMount, tick } from 'svelte';
	import { loadDeviceQuiz, saveQuiz } from '$lib/storage';
	import { page } from '$app/state';
	import { watch } from 'runed';

	let quiz = $state<Quiz>();
	let loading = $state(true);
	let editing = $state(-1);
	let open_settings = $state(false);
	let quiz_title_el = $state<HTMLInputElement>();

	onMount(async () => {
		if (quiz) return (loading = false);
		quiz = (await loadDeviceQuiz(page.params.quizid)) || undefined;
		await tick();
		loading = false;
	});

	watch(
		() => $state.snapshot(quiz),
		(v) => {
			if (loading || !v) return;
			saveQuiz(v);
		},
		{
			lazy: true,
		},
	);
</script>

<div class="sticky top-0 w-full bg-white border-b border-zinc-200 p-2 flex gap-2 items-center z-20">
	{#if editing < 0}
		<a class="font-bold text-svelte text-2xl" href="/quiz"> Quizbe </a>

		<span class="w-px h-4 bg-zinc-200"></span>

		<button
			class="min-w-48 text-sm font-medium px-2 h-8 text-left rounded transition hover:(bg-zinc-100)"
			onclick={() => {
				open_settings = true;
				if (quiz_title_el) quiz_title_el.focus();
			}}
		>
			{quiz?.title || 'Untitled quiz'}
		</button>

		<span class="flex-1"></span>

		<Button size="sm" label="Settings" icon={Gear} onclick={() => (open_settings = true)} />

		<Button
			size="sm"
			label="Exit"
			icon={ArrowElbowDownLeft}
			onclick={() => goto(`/quiz/${quiz?.id}/edit`)}
			ui={{
				base: 'bg-red-50 border-red-100 text-red-500',
			}}
		/>
	{:else}
		{@const question = quiz?.questions[editing]}
		{#if question}
			<Button size="sm" icon={ArrowElbowDownLeft} onclick={() => (editing = -1)} />

			<SelectSingle
				size="sm"
				bind:value={
					() => question.type,
					(v) => {
						if (!quiz?.questions[editing]) return;
						quiz.questions[editing] = BLANK_QUESTIONS[v];
					}
				}
				items={Object.keys(TYPE_OF_QUESTIONS).map((v) => ({
					label: TYPE_OF_QUESTIONS[v as Question['type']],
					value: v,
					icon: ICONS_OF_QUESTION_TYPES[v as Question['type']],
				}))}
				icon={ICONS_OF_QUESTION_TYPES[question.type]}
			/>

			<span class="flex-1"></span>

			<SelectSingle
				size="sm"
				bind:value={() => question.points.toString(), (v) => (question.points = parseInt(v))}
				items={Array.from({ length: 20 }).map((_, i) => ({
					label: `${i + 1} point${i > 0 ? 's' : ''}`,
					value: (i + 1).toString(),
				}))}
			/>

			<SelectSingle
				size="sm"
				bind:value={() => question.time.toString(), (v) => (question.time = parseFloat(v))}
				items={TIMELIMIT_KEYS_QUESTION.map((t) => ({
					label: TIMELIMIT_QUESTION[t],
					value: t.toString(),
				}))}
			/>
		{/if}
	{/if}
</div>

<div class="p-4">
	{#if loading || !quiz}
		{#each { length: 5 }, idx (idx)}
			<div
				class="max-w-7xl mx-auto border border-zinc-200 rounded-lg bg-white p-4 flex flex-col gap-4"
			>
				<div class="flex gap-2">
					<span class="size-6 bg-zinc-200 rounded animate-pulse"></span>
					<div class="bg-zinc-200 h-6 w-30 rounded animate-pulse"></div>
					<div class="bg-zinc-200 h-6 w-30 rounded animate-pulse"></div>
					<div class="bg-zinc-200 h-6 w-30 rounded animate-pulse"></div>
					<span class="flex-1"></span>
					<span class="size-6 bg-zinc-200 rounded animate-pulse"></span>
					<span class="h-6 w-12 bg-zinc-200 rounded animate-pulse"></span>
					<span class="size-6 bg-red-200 rounded animate-pulse"></span>
				</div>

				<div>
					<div>
						<div class="h-6 w-md bg-zinc-200 rounded animate-pulse"></div>
					</div>
				</div>
			</div>

			<div class="h-8"></div>
		{/each}
	{:else}
		{#each quiz.questions || [] as question, idx (idx)}
			<div
				class="max-w-7xl mx-auto border border-zinc-200 rounded-lg bg-white p-4 flex flex-col gap-4"
			>
				<div class="flex gap-2">
					<Button size="xs" icon={DotsSixVertical} />
					<div
						class="border h-6 rounded-md border-zinc-200 text-xs flex items-center px-2 font-medium"
					>
						{idx + 1}. {TYPE_OF_QUESTIONS[question.type]}
					</div>

					<SelectSingle
						size="xs"
						bind:value={() => question.points.toString(), (v) => (question.points = parseInt(v))}
						items={Array.from({ length: 20 }).map((_, i) => ({
							label: `${i + 1} point${i > 0 ? 's' : ''}`,
							value: (i + 1).toString(),
						}))}
					/>

					<SelectSingle
						size="xs"
						bind:value={() => question.time.toString(), (v) => (question.time = parseFloat(v))}
						items={TIMELIMIT_KEYS_QUESTION.map((t) => ({
							label: TIMELIMIT_QUESTION[t],
							value: t.toString(),
						}))}
					/>

					<span class="flex-1"></span>

					<Button
						size="xs"
						icon={Copy}
						onclick={() => quiz?.questions.splice(idx + 1, 0, question)}
					/>
					<Button size="xs" icon={Pen} label="Edit" onclick={() => (editing = idx)} />
					<Button
						size="xs"
						icon={Trash}
						ui={{ base: 'bg-red-50 border-red-200 text-red-600' }}
						onclick={() => quiz?.questions.splice(idx, 1)}
					/>
				</div>

				{#if question.type === 'multiple'}
					<div class="flex gap-4">
						<div class="flex-1 flex flex-col gap-4">
							{question.text}
						</div>

						<div class="flex-1 grid grid-cols-2 gap-4">
							{#each question.answers as answer, idx (idx)}
								<div class="flex gap-2 items-center">
									{#if answer.correct}
										<Check class="text-green" />
									{:else}
										<X class="text-red" />
									{/if}

									{#if answer.media}
										<img src={answer.media} alt="answer's media" />
									{/if}

									<span>
										{answer.text}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="h-8"></div>
		{/each}
	{/if}
</div>

<Editor bind:quiz {editing} />

{#if quiz && quiz.questions.length < 1}
	<NoQuestions bind:editing />
{/if}

<Dialog.Root bind:open={open_settings}>
	<Dialog.Portal>
		<Dialog.Overlay class={['inset-0 fixed transition bg-white/50 z-20']} forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:fade={{ duration: 150 }}></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>
		<Dialog.Content
			class="bg-white z-20 fixed w-full max-w-2xl rounded-xl p-4 left-1/2 top-1/2 -translate-1/2 border border-zinc-200 shadow-lg"
		>
			{#if quiz}
				<input bind:this={quiz_title_el} bind:value={quiz.title} type="text" />
			{/if}

			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(body) {
		--at-apply: bg-zinc-100;
	}
</style>
