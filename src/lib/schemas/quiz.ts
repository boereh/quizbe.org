import type { Component } from 'svelte';
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
import Checks from '~icons/ph/check-square-offset';
import PencilLine from '~icons/ph/pencil-line';
import ChartScatter from '~icons/ph/chart-scatter';
import Hand from '~icons/ph/hand';
import CaretDown from '~icons/ph/caret-up-down-fill';
import Columns from '~icons/ph/columns';
import Video from '~icons/ph/video';
import SubtractSquare from '~icons/ph/subtract-square';
import MathOperations from '~icons/ph/math-operations';

export type QuestionsRecord = {
	[K in Question['type']]: Extract<Question, { type: K }>;
};

export const TIMELIMIT_QUESTION: Record<number, string> = {
	10: '10 seconds',
	20: '20 seconds',
	30: '30 seconds',
	45: '45 seconds',
	60: '1 minute',
	120: '2 minutes',
	180: '3 minutes',
	300: '5 minutes',
	600: '10 minutes',
	1200: '20 minutes',
	1800: '30 minutes',
	3600: '1 hour',
};

export const TIMELIMIT_KEYS_QUESTION = Object.keys(TIMELIMIT_QUESTION).map(parseFloat);

export const BLANK_QUESTIONS: QuestionsRecord = {
	multiple: {
		type: 'multiple',
		points: 1,
		time: 30,
		media: '',
		text: '',
		single_answer: true,
		answers: [
			{ correct: false, media: '', text: '' },
			{ correct: false, media: '', text: '' },
		],
	},
	categorize: { type: 'categorize', points: 1, time: 30, text: '', categories: [] },
	drag: { type: 'drag', points: 1, time: 30, text: '', media: '', answers: [] },
	dropdown: { type: 'dropdown', points: 1, time: 30, text: '', media: '', answers: '' },
	match: { type: 'match', points: 1, time: 30, text: '', answers: [] },
	plot: { type: 'plot', points: 1, time: 30, text: '', answers: [] },
	type: { type: 'type', points: 1, time: 30, text: '', media: '', answer: '' },
	video: { type: 'video', points: 1, time: 30, media: '', timestamps: [] },
	math: { type: 'math', points: 1, time: 30, text: '', media: '', answer: '' },
};

export const ICONS_OF_QUESTION_TYPES: Record<Question['type'], Component> = {
	multiple: Checks,
	categorize: Columns,
	drag: Hand,
	dropdown: CaretDown,
	match: SubtractSquare,
	plot: ChartScatter,
	type: PencilLine,
	video: Video,
	math: MathOperations,
};

export const TYPE_OF_QUESTIONS: Record<Question['type'], string> = {
	multiple: 'Multiple Choice',
	categorize: 'Categorize',
	drag: "Drag n' Drop",
	dropdown: 'Dropdown',
	match: 'Match',
	plot: 'Plot',
	type: 'Type Answer',
	video: 'Video',
	math: 'Math Response',
};

export const QUESTION_MATH = object({
	type: literal('math'),
	text: string(),
	media: string(),
	answer: string(),
});

export const QUESTION_PLOT = object({
	type: literal('plot'),
	text: string(),
	answers: array(
		object({
			term: object({
				text: string(),
				media: string(),
			}),
			answer: object({
				text: string(),
				media: string(),
			}),
		}),
	),
});

export const QUESTION_MATCH = object({
	type: literal('match'),
	text: string(),
	answers: array(
		object({
			term: object({
				text: string(),
				media: string(),
			}),
			answer: object({
				text: string(),
				media: string(),
			}),
		}),
	),
});

export const QUESTION_CATEGORIZE = object({
	type: literal('categorize'),
	text: string(),
	categories: array(
		object({
			text: string(),
			media: string(),
			answers: array(string()),
		}),
	),
});

export const QUESTION_DROPDOWN = object({
	type: literal('dropdown'),
	text: string(),
	media: string(),
	answers: string(),
});

export const QUESTION_DRAG = object({
	type: literal('drag'),
	text: string(),
	media: string(),
	answers: array(string()),
});

export const QUESTION_TYPE = object({
	type: literal('type'),
	text: string(),
	media: string(),
	answer: string(),
});

export const QUESTION_MULTIPLE = object({
	type: literal('multiple'),
	single_answer: boolean(),
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

export const QUESTION_VIDEO = object({
	type: literal('video'),
	media: string(),
	timestamps: array(
		object({
			stamp: number(),
			points: number(),
			time: number(),
			question: union([
				QUESTION_MATCH,
				QUESTION_CATEGORIZE,
				QUESTION_MULTIPLE,
				QUESTION_DRAG,
				QUESTION_DROPDOWN,
				QUESTION_PLOT,
				QUESTION_TYPE,
			]),
		}),
	),
});

export const QUESTION_SCHEMA = intersect([
	object({
		points: number(),
		time: number(),
	}),
	union([
		QUESTION_MULTIPLE,
		QUESTION_CATEGORIZE,
		QUESTION_DRAG,
		QUESTION_DROPDOWN,
		QUESTION_MATCH,
		QUESTION_PLOT,
		QUESTION_TYPE,
		QUESTION_VIDEO,
		QUESTION_MATH,
	]),
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
export type Question = InferInput<typeof QUESTION_SCHEMA>;
