import { query } from '$app/server';
import { string } from 'valibot';

export const useFetchQuizes = query(() => {});
export const useFetchQuiz = query(string(), () => {});
