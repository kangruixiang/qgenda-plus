<script lang="ts">
	import { type FileHandlerState } from '$lib/utils.svelte';

	type Props = {
		data: FileHandlerState;
	};

	let { data }: Props = $props();

	let totalDays = $derived.by(() =>
		data.taskObject.reduce((sum, item) => sum + item.count * item.multiplier, 0)
	);
</script>

<div class="card card-lg">
	<h2 class="card-title text-secondary underline decoration-double decoration-2 mb-6">
		Task by Shifts
	</h2>

	<div class="card-body">
		<div
			class="grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center hover:bg-base-200 font-semibold text-sm w-full text-base-content/50 mb-4 border-b border-base-content/70"
		>
			<div class="col-span-3 px-golden-sm">Task Name</div>
			<div class="col-span-7">Actual Number of Shifts</div>
			<div class="col-span-1 text-center">Multiplier</div>
			<div class="col-span-1 text-center">Calculated</div>
		</div>

		{#each data.taskObject as item, i (item)}
			{@const percent = (item.count / data.totalCount) * 100}

			<div
				class="grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center group hover:bg-base-200"
			>
				<div class="col-span-3 px-golden-sm my-golden-sm">
					{item.task}
				</div>

				<div
					class="bg-secondary/20 h-6 col-span-7 flex space-x-golden-md relative border border-black"
				>
					<div
						class="bg-primary px-golden-md h-full text-[#f4ebd7] flex items-center justify-end group-hover:text-[#fcf9f2]"
						style={`width: ${percent}%`}
					>
						{#if item.count >= 1}
							{Math.round(item.count * 100) / 100}
						{/if}
					</div>
					{#if item.count < 1}
						<div class="">
							{item.count}
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

				<div class="col-span-1 whitespace-nowrap text-right pr-golden-sm">
					<span class="text-lg">{Math.round(item.count * item.multiplier * 100) / 100}</span>

					<span class="text-xs font-semibold text-base-content/50">shifts</span>
				</div>
			</div>
		{/each}

		<div
			class="border-t pr-golden-sm border-base-content/70 mt-golden-sm pt-golden-md grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center"
		>
			<div class="col-span-8 text-xl">Total Number of Shifts Worked After Calculation</div>
			<div class="col-span-2"></div>
			<div class="col-span-2 text-right whitespace-nowrap">
				<span class="text-4xl">{totalDays}</span>
				<span class="text-xs font-semibold text-base-content/50">shifts</span>
			</div>
		</div>
	</div>
</div>
