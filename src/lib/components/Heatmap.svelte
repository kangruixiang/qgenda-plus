<script lang="ts">
	import { type FileHandlerState } from '$lib/utils.svelte';

	type Props = {
		data: FileHandlerState;
	};

	let { data }: Props = $props();

	const colors = ['heatmap-0', 'heatmap-1', 'heatmap-2', 'heatmap-3', 'heatmap-4'];
</script>

<h2>Distribution by Month</h2>
<div
	class="grid gap-golden-md mx-golden-md grid-cols-12 overflow-x-auto"
	style={`grid-template-columns: 12rem repeat(${data.months.length}, 30px)`}
>
	<div></div>
	{#each data.months as month (month)}
		<div class="text-center w-full">
			{new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'short' })}
		</div>
	{/each}

	{#each data.taskObject as item, index (item.task)}
		<div class={index % 2 === 0 ? 'bg-base-200' : ''}>
			{item.task}
		</div>

		{#each data.months as month (month)}
			{@const count = data.counts.get(`${item.task}|${month}`) ?? 0}

			{@const level = data.getLevel(item.task, count)}

			<div
				class={`h-8 w-8 text-center rounded-sm flex items-center select-none   hover:border-primary hover:border justify-center justify-self-center ${colors[level]}`}
				title={`${item.task}: ${count}`}
			>
				{count}
			</div>
		{/each}
	{/each}
</div>
