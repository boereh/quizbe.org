<script lang="ts">
	import ArrowElbowDownLeft from '~icons/ph/arrow-elbow-down-left';
	import Gear from '~icons/ph/gear';
	import Button from '$lib/components/button.svelte';
	import { GridStack } from 'gridstack';
	import { onMount } from 'svelte';
	import { Dialog } from 'bits-ui';
	import { useQuiz } from '$lib/contexts';
	import { fade } from 'svelte/transition';
	import { Previous } from 'runed';
	const quiz = useQuiz();
	const pre_quiz = new Previous(() => quiz, quiz);

	let gs: GridStack;
	let editing = $state(-1);
	let open_settings = $state(true);

	onMount(() => {
		gs = GridStack.init({ column: 1 });
	});
</script>

<div class="sticky top-0 w-full bg-white border-b border-zinc-200 p-2 flex gap-2 items-center">
	{#if editing < 0}
		<span class="font-bold text-svelte text-2xl"> Quizbe </span>

		<span class="w-px h-4 bg-zinc-200"></span>

		<button
			class="min-w-48 text-sm font-medium px-2 h-8 text-left rounded transition hover:(bg-zinc-100)"
			onclick={() => {
				open_settings = true;
			}}
		>
			{quiz.title || 'Untitled Quiz'}
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
		yes
	{/if}
</div>

<div class="grid-stack"></div>

<Dialog.Root bind:open={open_settings}>
	<Dialog.Portal>
		<Dialog.Overlay class={['inset-0 fixed transition bg-black/50 z-19']} forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:fade={{ duration: 150 }}>
						<!-- ... -->
					</div>
				{/if}
			{/snippet}
		</Dialog.Overlay>
		<Dialog.Content
			class="bg-white z-20 fixed w-full max-w-2xl rounded-xl p-4 left-1/2 top-1/2 -translate-1/2"
		>
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
