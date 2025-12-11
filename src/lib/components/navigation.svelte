<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		right?: Snippet;
	};

	const { children, right }: Props = $props();
</script>

<div class="sticky top-0 w-full bg-white border-b border-zinc-200 p-2 flex gap-2 items-center z-20">
	<a class="font-bold text-svelte text-2xl" href="/quiz">Quizbe</a>
	<span class="font-bold text-svelte text-2xl"> Quizbe </span>

	<span class="w-px h-4 bg-zinc-200"></span>

	{@render children?.()}

	<span class="flex-1"></span>

	{@render right?.()}
</div>
