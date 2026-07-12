<script lang="ts">
	import { Computer, Mail } from '@lucide/svelte';

	import { FileHandlerState } from './utils.svelte';

	const colors = ['heatmap-0', 'heatmap-1', 'heatmap-2', 'heatmap-3', 'heatmap-4'];

	const data = new FileHandlerState();
</script>

<h1 class="pb-3 text-primary font-semibold">Qgenda Plus</h1>
<p class="prose max-w-none pb-4">Get analysis of your Qgenda schedule.</p>

<div class="flex flex-col gap-y-4">
	<input type="file" accept=".csv" onchange={data.handleFile} />

	<select bind:value={data.selectedStaff} class="select" onchange={data.getTaskCounts}>
		<option disabled selected>Name</option>
		{#if data.staffNames.length > 0}
			{#each data.staffNames as name (name)}
				<option>{name}</option>
			{/each}
		{/if}
	</select>

	<hr />

	<h2>{data.selectedStaff}</h2>

	{#if data.selectedStaff}
		<div class="space-y-3">
			{#each data.taskObject as item, i (item)}
				<div class="grid grid-cols-12 gap-y-golden-sm items-center hover:bg-base-200 px-golden-md">
					<div class="col-span-3 my-golden-sm">
						{item.task}
					</div>

					<div class="bg-base-300 h-6 col-span-8 border border-black">
						<div
							class="bg-primary h-6"
							style={`width: ${(item.count / data.totalCount) * 100}%`}
						></div>
					</div>

					<div class="col-span-1 text-right">
						<span class="text-lg">{item.count}</span>
						<span class="text-sm text-zinc-600">days</span>
					</div>
				</div>
			{/each}
		</div>

		<div
			class="grid gap-golden-md grid-cols-12 overflow-x-auto"
			style={`grid-template-columns: 12rem repeat(${data.months.length}, 30px)`}
		>
			<div></div>
			{#each data.months as month (month)}
				<div class="text-center w-full">
					{new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'short' })}
				</div>
			{/each}

			{#each data.taskObject as item (item)}
				<div>
					{item.task}
				</div>

				{#each data.months as month (month)}
					{@const count = data.counts.get(`${item.task}|${month}`) ?? 0}

					{@const level = data.getLevel(item.task, count)}

					<div
						class={`h-8 w-8 text-center rounded-sm flex items-center justify-center justify-self-center ${colors[level]}`}
						title={`${item.task}: ${count}`}
					>
						{count}
					</div>
				{/each}
			{/each}
		</div>
	{/if}
</div>

<div class="mt-4 justify-end text-sm text-right flex gap-x-2">
	Made by Kang.
	<a href="mailto:kxiang.wakehealth.edu"><Mail /></a>
	<a href="https://github.com/kangruixiang/bronchmeds"><Computer /></a>
</div>
