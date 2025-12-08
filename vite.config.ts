import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import unocss from 'unocss/vite';
import {
	presetWebFonts,
	presetWind4,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';
import unicons from 'unplugin-icons/vite';
import presetAnimations from 'unocss-preset-animations';

export default defineConfig({
	plugins: [
		sveltekit(),
		unocss({
			theme: {
				colors: {
					svelte: {
						DEFAULT: '#FF3E00',
						50: '#FFECE5',
						100: '#FFD8CC',
						200: '#FFB299',
						300: '#FF8B66',
						400: '#FF6533',
						500: '#FF3E00',
						600: '#CC3200',
						700: '#992500',
						800: '#661900',
						900: '#330C00',
						950: '#1A0600',
					},
				},
			},
			presets: [
				presetWind4({
					preflights: {
						reset: true,
					},
				}),
				presetWebFonts({
					fonts: {
						sans: 'Poppins:400,500,700,900',
					},
				}),
				presetAnimations(),
			],
			transformers: [transformerCompileClass(), transformerDirectives(), transformerVariantGroup()],
			content: {
				pipeline: {
					include: [
						// the default
						/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
						// include js/ts files
						'(components|src)/**/*.{js,ts}',
					],
				},
			},
		}),
		unicons({
			compiler: 'svelte',
		}),
	],
});
