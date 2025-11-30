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
						50: '#FFC9B8',
						100: '#FFBAA3',
						200: '#FF9B7A',
						300: '#FF7C52',
						400: '#FF5D29',
						500: '#FF3E00',
						600: '#C73000',
						700: '#8F2300',
						800: '#571500',
						900: '#1F0700',
						950: '#030100',
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
