import { polar, checkout } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { POLAR_TOKEN, POLAR_SERVER, QUIZBE_PLUS_ID } from '$env/static/private';

export const polar_client = new Polar({
	accessToken: POLAR_TOKEN,
	server: POLAR_SERVER === 'sandbox' ? 'sandbox' : 'production',
});

export const polar_plugin = polar({
	client: polar_client,
	createCustomerOnSignUp: true,

	use: [
		checkout({
			products: [
				{
					productId: QUIZBE_PLUS_ID,
					slug: 'plus',
				},
			],
			authenticatedUsersOnly: true,
		}),
	],
});
