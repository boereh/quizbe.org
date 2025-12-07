import { createStorage } from 'unstorage';
import idb_driver from 'unstorage/drivers/indexedb';
import type { Quiz } from './schemas/quiz';

export function useQuizStorage() {
	return createStorage<Quiz>({
		driver: idb_driver({ dbName: 'quizbe', storeName: 'quizzes' }),
	});
}
