<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/button.svelte';
	import { useQuiz } from '$lib/contexts';
	import type { Quiz } from '$lib/schemas/quiz';
	import { useButtonVariant } from '$lib/variants';
	import Plus from '~icons/ph/plus';
	import Sad from '~icons/ph/smiley-sad';

	const FILTERS = { Quizes: '', 'Shared with me': 'swm' };

	let filter = $state('');
	const quizzes = $state<Quiz[]>([]);
</script>

<div class="bg-white border-b border-zinc-200 sticky top-0 p-2 flex items-center gap-2">
	<span class="font-bold text-svelte text-2xl"> Quizbe </span>
	<span class="flex-1"></span>
</div>

<div class="p-4">
	<div class="max-w-7xl mx-auto space-y-4">
		<!-- <div class="flex gap-4"> -->
		<!-- {#each Object.entries(FILTERS) as [label, value] (label)}
				<Button
					{label}
					ui={{
						base: [
							filter === value
								? ''
								: ' border bg-white border-zinc-100 hover:(border bg-zinc-50) active:(border-0)',
						],
					}}
					onclick={() => (filter = value)}
				/>
			{/each} -->
		<!-- </div> -->

		{#if quizzes.length < 1}
			<div class="fixed inset-0 top-12 flex flex-col gap-4 items-center justify-center">
				<h1 class="text-4xl flex gap-2">
					<Sad />
					Oh naur!
				</h1>

				<p class="text-black/50 text-center">
					It seems we don’t have any quizzes created yet.
					<br />
					Let's kick off the interactive learning by creating a new quiz!
				</p>

				<a
					class={useButtonVariant().base({
						size: 'md',
						class: 'bg-svelte-50 text-svelte border-svelte-100',
					})}
					href={resolve('/quiz/new')}
				>
					<Plus />

					Create new quiz
				</a>
			</div>
		{/if}
	</div>
</div>
