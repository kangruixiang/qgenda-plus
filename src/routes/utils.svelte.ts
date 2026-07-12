import Papa from 'papaparse';
import { SvelteSet } from 'svelte/reactivity';

type ScheduleRow = {
	'Schedule Date': string;
	'Task Abbreviation': string;
	'Schedule Start Time': string;
	'Schedule End Time': string;
	'Staff Last Name': string;
};

export function handleFile(event: Event) {
	let rows: ScheduleRow[] = $state([]);
	let staffNames = $state<string[]>([]);

	const file = (event.target as HTMLInputElement).files?.[0];

	if (!file) return;

	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		worker: true,
		complete: ({ data }) => {
			rows = data;

			// gets staff names
			staffNames = Array.from(new SvelteSet(data.map((row: any) => row['Staff Last Name']).sort()));
		}
	});

	return {
		get rows() {
			return rows;
		},
		get staffNames() {
			return staffNames;
		}
	};
}
