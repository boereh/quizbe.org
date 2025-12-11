<script lang="ts">
	import { resolve } from '$app/paths';

	const { children } = $props();
</script>

<div class="sticky top-0 w-full bg-white border-b border-zinc-200 p-2 flex gap-2 items-center z-20">
	<a class="font-bold text-svelte text-2xl" href={resolve('/(app)/quiz')}> Quizbe </a>

	<span class="flex-1"></span>

	<a
		href={resolve('/(app)/signin')}
		class="h-8 flex items-center bg-zinc-100 rounded-full gap-2 pr-4 border border-zinc-200"
	>
		<span class="size-8 bg-white rounded-full border border-zinc-200"></span>
		<span> Sign in </span>
	</a>
</div>

{@render children()}

<style>
	:global(body) {
		--at-apply: bg-zinc-100;
	}
</style>
