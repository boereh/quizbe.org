<script lang="ts">
	import { isComponent, isSnippet } from '$lib';
	import type { Component, Snippet } from 'svelte';
	import type { ClassNameValue } from 'tailwind-merge';
	import { tv } from 'tailwind-variants';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['button'] & {
		children?: Snippet;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		icon?: string | Snippet | Component;
		ui?: {
			base?: ClassNameValue;
			icon?: ClassNameValue;
		};
	};

	let { children, size = 'md', icon, ui = {}, ...rest }: Props = $props();

	const classes = $derived(
		tv({
			slots: {
				base: 'cursor-pointer border bg-white border-zinc-200 flex items-center transition-all justify-center active:(shadow-none border-b-1)',
				icon: '',
			},
			variants: {
				size: {
					xs: {
						base: 'gap-1 text-xs px-4 rounded-md h-6 shadow border-b-3 hover:(shadow-sm border-b-2)',
						icon: '',
					},
					sm: {
						base: 'gap-2 text-sm px-4 rounded-lg h-8 shadow-md border-b-5 hover:(shadow border-b-3)',
						icon: '',
					},
					md: {
						base: 'gap-2 px-4 rounded-lg h-10 shadow-md border-b-5 hover:(shadow border-b-3)',
						icon: '',
					},
					lg: {
						base: 'gap-4 px-4 rounded-xl h-12 shadow-xl border-b-7 hover:(shadow border-b-4)',
						icon: '',
					},
					xl: {
						base: 'gap-4 px-6 rounded-2xl h-16 shadow-xl border-b-6 hover:(shadow border-b-3)',
						icon: '',
					},
				},
			},
		})({ size }),
	);
</script>

<button
	class={classes.base({
		class: [ui.base, icon && !children ? 'px-0 aspect-square' : ''],
	})}
	{...rest}
>
	{#if isSnippet(icon)}
		{@render icon?.()}
	{:else if isComponent(icon)}
		{@const Icon = icon}
		<Icon class={[classes.icon({ class: ui.icon })]} />
	{/if}

	{@render children?.()}
</button>
