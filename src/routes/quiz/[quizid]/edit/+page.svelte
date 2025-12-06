<script lang="ts">
	import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left';
	import Gear from '~icons/ph/gear';
	import Trash from '~icons/ph/trash';
	import Pen from '~icons/ph/pen';
	import Copy from '~icons/ph/copy';
	import DotsSixVertical from '~icons/ph/dots-six-vertical';
	import Button from '$lib/components/button.svelte';
	import { Dialog } from 'bits-ui';
	import { useQuiz } from '$lib/contexts';
	import { fade } from 'svelte/transition';
	import { QUESTION_TYPES } from '$lib/schemas/quiz';
	import Editor from './editor.svelte';

	const quiz = useQuiz();

	let editing = $state(1 - 1);
	let open_settings = $state(false);
	let quiz_title_el = $state<HTMLInputElement>();
</script>

<div class="sticky top-0 w-full bg-white border-b border-zinc-200 p-2 flex gap-2 items-center">
	{#if editing < 0}
		<span class="font-bold text-svelte text-2xl"> Quizbe </span>

		<span class="w-px h-4 bg-zinc-200"></span>

		<button
			class="min-w-48 text-sm font-medium px-2 h-8 text-left rounded transition hover:(bg-zinc-100)"
			onclick={() => {
				open_settings = true;
				if (quiz_title_el) quiz_title_el.focus();
			}}
		>
			{quiz.value?.title || 'Untitled Quiz'}
		</button>

		<span class="flex-1"></span>

		<Button size="sm" label="Settings" icon={Gear} onclick={() => (open_settings = true)} />

		<Button
			size="sm"
			label="Exit"
			icon={ArrowElbowDownLeft}
			onclick={() => window.history.back()}
			ui={{
				base: 'bg-red-50 border-red-100 text-red-500',
			}}
		/>
	{:else}
		<Button size="sm" icon={ArrowElbowDownLeft} onclick={() => (editing = -1)} />

		<span class="flex-1"></span>
	{/if}
</div>

<div class="p-4">
	{#each quiz.value?.questions || [] as question, idx (idx)}
		<div
			class="max-w-7xl mx-auto border border-zinc-200 rounded-lg bg-white p-4 flex flex-col gap-4"
		>
			<div class="flex gap-2">
				<Button size="xs" icon={DotsSixVertical} />
				<div
					class="border h-6 rounded-md border-zinc-200 text-xs flex items-center px-2 font-medium"
				>
					{idx + 1}. {QUESTION_TYPES[question.type]}
				</div>

				<span class="flex-1"></span>

				<Button size="xs" icon={Copy} />
				<Button size="xs" icon={Pen} label="Edit" onclick={() => (editing = idx)} />
				<Button size="xs" icon={Trash} ui={{ base: 'bg-red-50 border-red-200 text-red-600' }} />
			</div>

			{#if question.type === 'multiple'}
				<div class="flex">
					<div class="flex-1">
						{question.text}
					</div>

					<div class="flex-1 grid grid-cols-2"></div>
				</div>
			{/if}
		</div>

		<div class="h-8"></div>
	{/each}
</div>

<Editor {editing} />

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
			{#if quiz.value}
				<input bind:this={quiz_title_el} bind:value={quiz.value.title} type="text" />
			{/if}

			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
