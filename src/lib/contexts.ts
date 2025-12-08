import { createContext } from 'svelte';
import type { Quiz } from './schemas/quiz';

export const [useQuiz, setQuiz] = createContext<{ value: Quiz | undefined; loading: boolean }>();
