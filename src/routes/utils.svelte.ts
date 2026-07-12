import Papa from 'papaparse';
import { SvelteSet } from 'svelte/reactivity';

export type ScheduleRow = {
	'Schedule Date': string;
	'Task Abbreviation': string;
	'Schedule Start Time': string;
	'Schedule End Time': string;
	'Staff Last Name': string;
};

export class FileHandlerState {
	rows: ScheduleRow[] = $state([]);
	staffNames = $state<string[]>([]);

	handleFile = (event: Event) => {
		const file = (event.target as HTMLInputElement).files?.[0];

		if (!file) return;

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			worker: true,
			complete: ({ data }) => {
				this.rows = data;

				// gets staff names
				this.staffNames = Array.from(
					new SvelteSet(data.map((row: any) => row['Staff Last Name']).sort())
				);
			}
		});
	};
}
