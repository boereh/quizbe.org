import { env } from '$env/dynamic/private';
import { ut_route } from '$lib/server/uploadthing';
import { createRouteHandler } from 'uploadthing/server';

const handlers = createRouteHandler({
	router: { upload: ut_route },
	config: {
		token: env.UPLOADTHING_TOKEN,
	},
});

export { handlers as GET, handlers as POST };
