<script lang="ts">
	import { Computer, Mail } from '@lucide/svelte';
	import { SvelteMap } from 'svelte/reactivity';

	import { monthlyHeatmap } from '$lib/monthlyHeatmap';
	import { FileHandlerState, type ScheduleRow } from './utils.svelte';

	let selectedStaff = $state('');
	let personRows = $state<ScheduleRow[]>([]);
	let taskCounts: Record<string, number> = $state({});
	const data = new FileHandlerState();

	const counts = new SvelteMap<string, number>();
	let heatmapData = $derived.by(() => {
		return Array.from(counts.entries()).map(([key, count]) => {
			const [task, month] = key.split('|');

			return {
				task,
				month: new Date(`${month}-01`),
				count
			};
		});
	});

	let taskData = $derived.by(() => {
		// converts object to array of arrays and then map to array of objects and sort by count descending
		const data = Object.entries(taskCounts)
			.map(([task, count]) => ({
				task,
				count
			}))
			.sort((a, b) => b.count - a.count);

		const total = data.reduce((sum, item) => sum + item.count, 0);

		return data.map((item) => ({
			...item,
			percent: (item.count / total) * 100
		}));
	});

	let maxCount = $derived(Math.max(...taskData.map((d) => d.count)));

	function getTaskCounts() {
		taskCounts = {};
		counts.clear();

		// gets all rows for selected staff
		personRows = data.rows.filter((row: any) => row['Staff Last Name'] === selectedStaff);

		// gets task counts for selected staff
		for (const row of personRows) {
			const originalTask = row['Task Abbreviation'].replace(/-$/, '').trim();

			const task = originalTask.replace(/\s*\(?(AM|PM)\)?/, '');
			const isHalfDay = task !== originalTask;

			taskCounts[task] ??= 0;

			taskCounts[task] += isHalfDay ? 0.5 : 1;

			// count the number of times for each month
			const date = new Date(row['Schedule Date']);

			const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

			const key = `${task}|${month}`;

			if (!counts.has(key)) {
				counts.set(key, 1);
			} else {
				counts.set(key, counts.get(key)! + 1);
			}
		}
	}
</script>

<h1 class="pb-3 text-primary font-semibold">Qgenda Plus</h1>
<p class="prose max-w-none pb-4">Get analysis of your Qgenda schedule.</p>

<div class="flex flex-col gap-y-4">
	<input type="file" accept=".csv" onchange={data.handleFile} />

	<select bind:value={selectedStaff} class="select" onchange={getTaskCounts}>
		<option disabled selected>Name</option>
		{#if data.staffNames.length > 0}
			{#each data.staffNames as name (name)}
				<option>{name}</option>
			{/each}
		{/if}
	</select>

	<hr />

	<h2>{selectedStaff}</h2>

	{#if selectedStaff}
		<!-- chart:
		<PieChart data={taskData} key="task" value="count" height={300} cRange={schemeTableau10} /> -->

		<div class="space-y-3">
			{#each taskData as item, i (item)}
				<div class="grid grid-cols-12 gap-y-golden-sm items-center hover:bg-base-200 px-golden-md">
					<div class="col-span-3 my-golden-sm">
						{item.task}
					</div>

					<div class="bg-base-300 h-6 col-span-8 border border-black">
						<div class="bg-primary h-6" style={`width: ${(item.count / maxCount) * 100}%`}></div>
					</div>

					<div class="col-span-1 text-right">
						<span class="text-lg">{item.count}</span>
						<span class="text-sm text-zinc-600">days</span>
					</div>
				</div>
			{/each}
		</div>

		{#each heatmapData as item, i (item)}
			{item.task} - {item.count}
		{/each}

		<div use:monthlyHeatmap={heatmapData}></div>
	{/if}
</div>

<div class="mt-4 justify-end text-sm text-right flex gap-x-2">
	Made by Kang.
	<a href="mailto:kxiang.wakehealth.edu"><Mail /></a>
	<a href="https://github.com/kangruixiang/bronchmeds"><Computer /></a>
</div>
