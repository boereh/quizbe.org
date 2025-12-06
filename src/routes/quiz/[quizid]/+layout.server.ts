import type { Quiz } from '$lib/schemas/quiz';

export async function load({ parent, params: { quizid } }) {
	await parent();

	return {};
}

const EXAMPLE_QUIZ: Quiz = {
	id: 'example',
	title: 'Example',
	authors: [],
	created: new Date(),
	updated: new Date(),
	local: true,
	questions: [
		{
			type: 'multiple',
			text: 'An exact location or position represented by a dot and named with a capital letter.',
			image: '',
			points: 1,
			time: 30,
			answers: [
				{ text: 'Point', image: '', correct: true },
				{ text: 'Line Segment', image: '', correct: false },
				{ text: 'Ray', image: '', correct: false },
				{ text: 'Line', image: '', correct: false },
			],
		},
		{
			type: 'multiple',
			text: 'Straight line that goes on forever in both directions.',
			image: '',
			points: 1,
			time: 30,
			answers: [
				{ text: 'Point', image: '', correct: false },
				{ text: 'Line Segment', image: '', correct: false },
				{ text: 'Ray', image: '', correct: false },
				{ text: 'Line', image: '', correct: true },
			],
		},
		{
			type: 'multiple',
			text: 'Formed when two rays share the same endpoint.',
			image: '',
			points: 1,
			time: 30,
			answers: [
				{ text: 'Point', image: '', correct: false },
				{ text: 'Line Segment', image: '', correct: false },
				{ text: 'Ray', image: '', correct: false },
				{ text: 'angle', image: '', correct: true },
			],
		},
		{
			type: 'multiple',
			text: 'What type of angle measures exactly 90 degrees?',
			image: '',
			points: 1,
			time: 30,
			answers: [
				{ text: 'Acute', image: '', correct: false },
				{ text: 'Obtuse', image: '', correct: false },
				{ text: 'Straight', image: '', correct: false },
				{ text: 'Right', image: '', correct: true },
			],
		},
	],
};
