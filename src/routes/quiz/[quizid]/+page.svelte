<script module lang="ts">
	import { getContext } from 'svelte';
	import type { Quiz } from '../../create/+page.svelte';

	export const useQuiz = getContext<Quiz>('quiz');
</script>

<script lang="ts"></script>
