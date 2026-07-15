<script lang="ts">
	import { Computer, Mail } from '@lucide/svelte';

	import { FileHandlerState } from '$lib/utils.svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import Count from '$lib/components/Count.svelte';
	import Instructions from '$lib/components/Instructions.svelte';

	const data = new FileHandlerState();
</script>

<h1 class="pb-3 text-primary font-semibold">Qgenda Plus</h1>
<p class="prose max-w-none pb-4">Get analysis and insight of your Qgenda schedule.</p>

<Instructions />
<div class="flex flex-col gap-y-4 mt-10">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Upload Qgenda CSV export below:</legend>
		<input type="file" class="file-input" accept=".csv" onchange={data.handleFile} />
	</fieldset>

	{#if data.staffNames.length > 0}
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Pick staff:</legend>
			<select bind:value={data.selectedStaff} class="select" onchange={data.getTaskCounts}>
				<option disabled selected>Name</option>
				{#if data.staffNames.length > 0}
					{#each data.staffNames as name (name)}
						<option>{name}</option>
					{/each}
				{/if}
			</select>
		</fieldset>
	{/if}

	<hr class="text-base-content/70 mb-10" />

	{#if data.selectedStaff}
		<Count {data} />
		<Heatmap {data} />
	{/if}
</div>

<div class="mt-4 justify-end text-sm text-right flex gap-x-2">
	Made by Kang.
	<a href="mailto:kang.xiang@wfusm.edu"><Mail /></a>
	<a href="https://github.com/kangruixiang/qgenda-plus"><Computer /></a>
</div>
