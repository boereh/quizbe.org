import {
	array,
	boolean,
	date,
	intersect,
	literal,
	number,
	object,
	string,
	union,
	type InferInput,
} from 'valibot';

export const QUESTION_MULTIPLE = object({
	type: literal('multiple'),
	text: string(),
	image: string(),
	answers: array(
		object({
			text: string(),
			image: string(),
			correct: boolean(),
		}),
	),
});

export const QUESTION_SCHEMA = intersect([
	object({
		points: number(),
		time: number(),
	}),
	union([QUESTION_MULTIPLE]),
]);

export const QUIZ_SCHEMA = object({
	id: string(),
	title: string(),
	authors: array(string()),
	created: date(),
	updated: date(),
	questions: array(QUESTION_SCHEMA),
});

export type Quiz = InferInput<typeof QUIZ_SCHEMA>;
export type Question = Quiz['questions'];
