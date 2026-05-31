import { drizzle } from 'drizzle-orm/libsql';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createClient } from '@libsql/client';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$env/static/private';

export const libsql_client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN,
});

export const db = drizzle({ client: libsql_client, schema: {} });

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	age: integer('age'),
});
