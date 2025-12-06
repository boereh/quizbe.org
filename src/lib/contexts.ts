import { getContext } from 'svelte';
import type { Quiz } from './schemas/quiz';

export const useQuiz = () => getContext<{ value: Quiz }>('quiz');
