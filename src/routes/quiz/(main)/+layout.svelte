<script lang="ts">
	const { children } = $props();
</script>

<div class="bg-white border-b border-zinc-200 sticky top-0 p-2 flex items-center gap-2">
	<span class="font-bold text-svelte text-2xl"> Quizbe </span>
	<span class="flex-1"></span>
</div>

{@render children()}

<style>
	:global(body) {
		@apply bg-zinc-100;
	}
</style>
