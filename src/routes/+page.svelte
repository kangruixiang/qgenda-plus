<script lang="ts">
	import Papa from 'papaparse';
	import { PieChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';

	import { Check, Clipboard, Computer, Mail } from '@lucide/svelte';

	let inputText = $state('');
	let resultText = $state();
	let notification = $state('');
	let copiedFull = $state(false);

	type ScheduleRow = {
		'Schedule Date': string;
		'Task Abbreviation': string;
		'Schedule Start Time': string;
		'Schedule End Time': string;
		'Staff Last Name': string;
	};

	let rows: ScheduleRow[] = $state([]);
	let staffNames = $state<string[]>([]);
	let selectedStaff = $state('');
	let personRows = $state<ScheduleRow[]>([]);
	let taskCounts: Record<string, number> = $state({});
	let pieData = $derived(
		Object.entries(taskCounts).map(([task, count]) => ({
			task,
			count
		}))
	);

	async function copyFull() {
		await navigator.clipboard.writeText(resultText.innerText);
		copiedFull = true;
		setTimeout(() => {
			copiedFull = false;
		}, 1000);
	}

	function getTaskCounts() {
		taskCounts = {};

		// gets all rows for selected staff
		personRows = rows.filter((row: any) => row['Staff Last Name'] === selectedStaff);

		// gets task counts for selected staff
		for (const row of personRows) {
			const task = row['Task Abbreviation'];
			if (task in taskCounts) {
				if (task.includes('AM') || task.includes('PM')) {
					taskCounts[task] += 0.5;
				} else {
					taskCounts[task]++;
				}
			} else {
				taskCounts[task] = 1;
			}
		}

		console.log('pie', pieData);
	}

	function handleFile(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];

		if (!file) return;

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			worker: true,
			complete: ({ data }) => {
				rows = data;

				// gets staff names
				staffNames = Array.from(new Set(data.map((row: any) => row['Staff Last Name']).sort()));
			}
		});
	}
</script>

{#snippet copyClear(copyType: string, copyStatus: boolean, copy: () => void)}
	<div class="flex w-full flex-col md:flex-row gap-y-2 gap-x-2">
		<button
			disabled={copyStatus}
			onclick={copy}
			class="btn flex items-center gap-x-2 btn-primary grow"
			>{#if copyStatus}
				<Check size={18} />Copied
			{:else}
				<Clipboard size={18} />Copy {copyType}
			{/if}
		</button>
		<button onclick={() => (inputText = '')} class="btn grow">Clear</button>
	</div>
{/snippet}

<h1 class="pb-3 text-primary font-semibold">Template Starter for Sveltekit Page</h1>
<p class="prose max-w-none pb-4">
	Use this repository as starting template for Sveltekit page, with tailwindcss, Jost as default
	font, oklch, and daisyUI.
</p>

<div class="flex flex-col gap-y-4">
	<h2>{selectedStaff}</h2>

	<input type="file" accept=".csv" onchange={handleFile} />

	<select bind:value={selectedStaff} class="select" onchange={getTaskCounts}>
		<option disabled selected>Name</option>
		{#each staffNames as name (name)}
			<option>{name}</option>
		{/each}
	</select>

	{JSON.stringify(taskCounts, null, 2)}

	{#if selectedStaff}
		chart:
		<PieChart data={pieData} key="task" value="count" height={300} cRange={schemeTableau10} />
	{/if}
</div>

<div class="mt-4 justify-end text-sm text-right flex gap-x-2">
	Made by Kang.
	<a href="mailto:kxiang.wakehealth.edu"><Mail /></a>
	<a href="https://github.com/kangruixiang/bronchmeds"><Computer /></a>
</div>
