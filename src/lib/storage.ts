import { createStorage } from 'unstorage';
import idb_driver from 'unstorage/drivers/indexedb';
import { QUIZ_SCHEMA, type Quiz } from './schemas/quiz';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { safeParse } from 'valibot';
import { useDebounce } from 'runed';

export function useQuizStorage() {
	return createStorage<Quiz>({
		driver: idb_driver({ dbName: 'quizbe', storeName: 'quizzes' }),
	});
}

export const saveQuiz = useDebounce(async (quiz: Quiz) => {
	if (!quiz) return;
	if (quiz.local) return useQuizStorage().set(quiz.id, quiz);
}, 500);

export async function loadDeviceQuiz(id?: string) {
	if (!id) return goto(resolve('/quiz'));
	const storage = useQuizStorage();
	const parsed = safeParse(QUIZ_SCHEMA, await storage.get(id));
	if (!parsed.success) return goto(resolve('/quiz'));
	return parsed.output;
}
