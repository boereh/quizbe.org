import {
	array,
	boolean,
	intersect,
	literal,
	number,
	object,
	string,
	union,
	type InferInput,
} from 'valibot';

export const QUESTION_TYPES: Record<Question[0]['type'], string> = {
	multiple: 'Multiple Choice',
};

export const QUESTION_MULTIPLE = object({
	type: literal('multiple'),
	text: string(),
	media: string(),
	answers: array(
		object({
			text: string(),
			media: string(),
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
	created: number(),
	updated: number(),
	questions: array(QUESTION_SCHEMA),
	local: boolean(),
});

export type Quiz = InferInput<typeof QUIZ_SCHEMA>;
export type Question = Quiz['questions'];
