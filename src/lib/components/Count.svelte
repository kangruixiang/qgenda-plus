<script lang="ts">
	import { type FileHandlerState } from '$lib/utils.svelte';

	type Props = {
		data: FileHandlerState;
	};

	let { data }: Props = $props();

	let makeFutureTasks = $state(false);

	let totalDays = $derived.by(() =>
		data.taskObject.reduce((sum, item) => sum + item.count * item.multiplier, 0)
	);
	let futureTotalDays = $derived.by(() =>
		data.futureTaskObject.reduce((sum, item) => sum + item.count * item.multiplier, 0)
	);
	let differenceDays = $derived(futureTotalDays - totalDays);
</script>

<div class="card card-lg">
	<h2 class="card-title text-secondary underline decoration-double decoration-2 mb-6">
		Task by Shifts
	</h2>

	<p class="prose border-b border-base-content/50">
		Not all shifts are counted equal. <span class="font-bold">Actual Number of Shifts</span> corresponds
		to how many times the task appeared on Qgenda, which is then adjusted with the multiplier. Night MICU
		Attending, for example, counts as 0.5 calculated shift. Consults/PPT Weekend are counted as 0 as they
		are usually tagged along MICU weekend shift. Night Pulm Attending also counts as 0 as they usually
		tagged onto MICU Night.
	</p>

	<p class="prose">
		Use hypothetical scenario option to increase or decrease shifts and see how the total number of
		shifts change.
	</p>

	<label class="label my-golden-md"
		>Add hypothetical scenario
		<input type="checkbox" bind:checked={makeFutureTasks} class="toggle" />
	</label>

	<div class="card-body">
		<div
			class="grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center hover:bg-base-200 font-semibold text-sm w-full text-base-content/50 mb-4 border-b border-base-content/70"
		>
			<div class="col-span-3 px-golden-sm">Task Name</div>
			<div class="col-span-6">Actual Number of Shifts</div>
			<div class="col-span-1 text-center">Multiplier</div>
			<div class="col-span-2 text-right">Calculated</div>
		</div>

		{#each data.taskObject as item, i (item)}
			{@const percent = (item.count / data.totalCount) * 100}
			{@const newItem = data.futureTaskObject[i]}

			<div
				class={`${
					makeFutureTasks ? 'py-golden-md' : ''
				} grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center group hover:bg-base-200`}
			>
				<div class="col-span-3 px-golden-sm my-golden-sm">
					{item.task}
				</div>

				<div class="col-span-6 relative flex flex-col gap-y-golden-sm">
					<div class="flex bg-secondary/20 space-x-golden-md h-6 border border-black">
						<div
							class="bg-primary px-golden-md h-full text-[#f4ebd7] flex items-center justify-end group-hover:text-[#fcf9f2]"
							style={`width: ${percent}%`}
						>
							{#if item.count >= 1}
								{Math.round(item.count * 100) / 100}
							{/if}
						</div>
						{#if item.count < 1}
							<div>
								{item.count}
							</div>
						{/if}
					</div>

					{#if makeFutureTasks}
						<div class="flex items-center justify-center gap-golden-sm">
							<input
								type="range"
								min="0"
								step="0.5"
								max={item.count + 20}
								class="range rounded-none w-full text-[#bab7a6] [--range-thumb:#584d09] dark:text-base-300 dark:[--range-thumb:#3a382c]"
								bind:value={newItem.count}
							/>
							<span class="w-10 text-base-content/70"> {newItem.count}</span>
						</div>
					{/if}
				</div>

				<div class="col-span-1 flex">
					<input
						type="number"
						class="input"
						required
						placeholder=""
						min="0"
						max="5"
						step="0.5"
						bind:value={item.multiplier}
						title="days"
					/>
				</div>

				<div class="col-span-2 text-right pr-golden-sm whitespace-nowrap">
					<span class="text-lg">{Math.round(item.count * item.multiplier * 100) / 100}</span>

					<span class="text-xs font-semibold text-base-content/50">shifts</span>

					{#if makeFutureTasks && newItem.count - item.count != 0}
						<hr class="text-base-300 ml-golden-lg" />
						{newItem.count - item.count > 0 ? '+' : ''}{newItem.count - item.count}
					{/if}
				</div>
			</div>
		{/each}

		<div
			class="border-t pr-golden-sm border-base-content/70 mt-golden-sm pt-golden-md grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center"
		>
			{#snippet snippetTotalCount(title: string, totalDays: number, future: boolean)}
				<div class="col-span-7 text-xl">{title}</div>
				<div class="col-span-1"></div>
				<div class="col-span-4 text-right whitespace-nowrap">
					<span class="text-4xl">{totalDays}</span>
					{#if future}
						<span class="text-base-content/50"
							>({differenceDays > 0 ? '+' : '-'}{differenceDays})</span
						>
					{/if}
					<span class="text-xs font-semibold text-base-content/50">shifts</span>
				</div>
			{/snippet}

			{@render snippetTotalCount(
				'Total Number of Shifts Worked After Calculation',
				totalDays,
				false
			)}
			{#if makeFutureTasks}
				{@render snippetTotalCount('Total Hypothetical Shifts', futureTotalDays, true)}
			{/if}
		</div>
	</div>
</div>
