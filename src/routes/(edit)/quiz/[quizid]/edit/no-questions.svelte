<script lang="ts">
	import {
		ICONS_OF_QUESTION_TYPES,
		BLANK_QUESTIONS,
		TYPE_OF_QUESTIONS,
		type Question,
		type Quiz,
	} from '$lib/schemas/quiz';

	type Category = {
		label: string;
		class: string;
		types: Question['type'][];
	};

	let { editing = $bindable(-1), quiz = $bindable() }: { editing: number; quiz: Quiz } = $props();

	const CATEGORIES: Category[] = [
		{
			label: 'Basic',
			class: 'bg-svelte-50 text-svelte',
			types: ['multiple', 'type', 'drag', 'dropdown', 'categorize', 'match', 'video'],
		},
		{
			label: 'Math',
			class: 'bg-cyan-50 text-blue-600',
			types: ['plot', 'math'],
		},
	];
</script>

<div class="inset-0 top-12 fixed bg-zinc-100 grid place-items-center p-4">
	<div class="bg-white p-4 border border-zinc-200 rounded-xl w-full max-w-7xl">
		<h1 class="text-center text-2xl py-6">Create your first question</h1>
		{#each CATEGORIES as category, idx (idx)}
			<div class="col-span-4 text-sm py-4 text-zinc-600">{category.label}</div>

			<div class="grid grid-cols-4 gap-2">
				{#each category.types as question, qidx (qidx)}
					{@const TypeIcon = ICONS_OF_QUESTION_TYPES[question]}

					<button
						class="flex items-center p-2 gap-2 hover:(bg-zinc-100) rounded-md group transition font-medium cursor-pointer select-none"
						onclick={() => {
							if (!quiz) return;
							quiz.questions.push(BLANK_QUESTIONS[question]);
							editing = 0;
						}}
					>
						<TypeIcon
							class={[
								'rounded size-8 p-1 transition',
								category.class,
								'group-hover:(bg-transparent)',
							]}
						/>

						{TYPE_OF_QUESTIONS[question]}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>
