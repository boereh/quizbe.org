import { createUploadthing } from 'uploadthing/server';

const buildUT = createUploadthing();

const auth = async (req: Request) => ({ id: 'fakeId' }); // Fake auth function

export const ut_route = buildUT({
	image: {
		maxFileSize: '8MB',
		maxFileCount: 1,
	},
})
	.middleware(async ({ req }) => {
		const user = await auth(req);

		if (!user) throw new Error('Unauthorized');

		return { userId: user.id };
	})
	.onUploadComplete(async ({ metadata, file }) => {
		console.log('Upload complete for userId:', metadata.userId);

		console.log('file url', file.ufsUrl);
	});
