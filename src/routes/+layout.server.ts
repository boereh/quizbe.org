export async function load({ platform }) {
	console.log(platform?.env.QUIZBE);
	return { hello: 'world' };
}
