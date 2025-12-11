import { betterAuth } from 'better-auth';
import { polar_plugin } from './polar';
import { BETTER_AUTH_SECRET } from '$env/static/private';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

export const auth = betterAuth({
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	plugins: [polar_plugin],
});
