<script lang="ts">
	import { type FileHandlerState } from '$lib/utils.svelte';

	type Props = {
		data: FileHandlerState;
	};

	let { data }: Props = $props();
</script>

<div class="card card-lg">
	<h2 class="card-title text-secondary underline decoration-double decoration-2 mb-6">
		Task by Days
	</h2>

	<div class="card-body">
		{#each data.taskObject as item, i (item)}
			<div class="grid grid-cols-12 gap-y-golden-sm gap-x-golden-sm items-center hover:bg-base-200">
				<div class="col-span-3 px-golden-sm my-golden-sm">
					{item.task}
				</div>

				<div class="bg-secondary/20 h-6 col-span-8 border border-black">
					<div
						class="bg-primary h-6"
						style={`width: ${(item.count / data.totalCount) * 100}%`}
					></div>
				</div>

				<div class="col-span-1 text-right pr-golden-sm">
					<span class="text-lg">{item.count}</span>
					<span class="text-xs font-semibold text-base-content/50">days</span>
				</div>
			</div>
		{/each}

		<div class="prose max-w-none border-t border-base-content/70 mt-golden-sm pt-golden-md">
			Weekend days are excluded from normal tasks. For example, MICU A weekend are not counted in
			MICU A days. Consults/PPT weekend should be the same number as MICU C weekend since they cover
			the same schedule. Half day (AM or PM) shifts are counted as 0.5 days. Nights are counted as 1
			day.
		</div>
	</div>
</div>
