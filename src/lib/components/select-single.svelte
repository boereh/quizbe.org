<script lang="ts">
	import { useSelectVariant } from '$lib/variants';
	import { Select } from 'bits-ui';
	import CaretUpDown from '~icons/ph/caret-up-down';

	type Props = {
		value: string;
		items: Array<{ value: string; label: string }>;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		open?: boolean;
	};

	let { value = $bindable(), items, size = 'md', open = $bindable(false) }: Props = $props();
</script>

<Select.Root bind:value bind:open type="single">
	<Select.Trigger
		class={useSelectVariant().trigger({
			size,
			class: [open ? 'border-b hover:(border-b)' : ''],
		})}
	>
		{items.find((i) => i.value === value)?.label}

		<CaretUpDown class="size-3" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content class={useSelectVariant().content({ size })}>
			<Select.ScrollUpButton />
			<Select.Viewport class="flex flex-col gap-1">
				{#each items as item, idx (idx)}
					<Select.Item value={item.value} class={useSelectVariant().item({ size })}>
						{item.label}
					</Select.Item>
				{/each}
				<Select.ScrollDownButton />
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
