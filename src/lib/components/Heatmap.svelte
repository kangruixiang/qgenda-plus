<script lang="ts">
	import { type FileHandlerState } from '$lib/utils.svelte';

	type Props = {
		data: FileHandlerState;
	};

	let { data }: Props = $props();

	const colors = ['heatmap-0', 'heatmap-1', 'heatmap-2', 'heatmap-3', 'heatmap-4'];
	const heatmapColorLevel = [0, 1, 2, 3, 4];

	const textColors = [
		'text-base', // 0
		'text-neutral-900',
		'text-neutral',
		'text-neutral-50',
		'text-neutral-50' // 4
	];
</script>

<div class="card card-lg mt-10">
	<h2 class="card-title underline text-secondary decoration-double decoration-2 mb-6">
		Distribution by Month
	</h2>
	<div
		class="grid card-body gap-golden-md items-center mx-golden-md overflow-x-auto"
		style={`grid-template-columns: 13rem repeat(${data.months.length}, 30px)`}
	>
		<div></div>
		{#each data.months as month (month)}
			<div class="text-center font-semibold text-xs w-full text-base-content/50">
				{new Date(`${month}-02`).toLocaleDateString(undefined, { month: 'short' })}
			</div>
		{/each}

		{#each data.taskObject as item, index (item.task)}
			<div class="{index % 2 === 0 ? 'bg-base-200' : ''} pl-golden-sm">
				{item.task}
			</div>

			{#each data.months as month (month)}
				<!-- gets the count for the task for this month -->
				{@const count = data.counts.get(`${item.task}|${month}`) ?? 0}

				<!-- // gets the level of intensity -->
				{@const level = data.getLevel(item.task, count)}

				<div
					class={`h-8 w-8 text-center rounded-sm flex items-center select-none hover:border-primary hover:border justify-center justify-self-center ${colors[level]} ${textColors[level]}`}
					title={`${item.task}: ${count}`}
				>
					{count}
				</div>
			{/each}
		{/each}
	</div>

	<div
		class="mx-golden-2xl prose max-w-none border-t border-base-content/70 mt-golden-sm pt-golden-md"
	>
		Different color intensity corresponds to level of workload for that task compared to its average
		for the year.

		<div class="flex m-golden-md space-x-golden-sm">
			{#each heatmapColorLevel as level (level)}
				<div
					class={`h-8 w-8 rounded-sm flex items-center justify-center select-none ${colors[level]} ${textColors[level]}`}
				>
					{level}
				</div>
			{/each}
		</div>
	</div>
</div>
