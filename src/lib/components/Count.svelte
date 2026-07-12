<script lang="ts">
	import { type FileHandlerState } from '$lib/utils.svelte';

	type Props = {
		data: FileHandlerState;
	};

	let { data }: Props = $props();
</script>

<h2>Task by Days</h2>

<div class="space-y-3 mx-golden-md">
	{#each data.taskObject as item, i (item)}
		<div class="grid grid-cols-12 gap-y-golden-sm items-center hover:bg-base-200">
			<div class="col-span-3 my-golden-sm">
				{item.task}
			</div>

			<div class="bg-base-300 h-6 col-span-8 border border-black">
				<div class="bg-primary h-6" style={`width: ${(item.count / data.totalCount) * 100}%`}></div>
			</div>

			<div class="col-span-1 text-right">
				<span class="text-lg">{item.count}</span>
				<span class="text-sm text-zinc-600">days</span>
			</div>
		</div>
	{/each}
</div>
