import Papa from 'papaparse';
import { SvelteSet, SvelteMap, SvelteDate } from 'svelte/reactivity';

export type ScheduleRow = {
	'Schedule Date': string;
	'Task Abbreviation': string;
	'Schedule Start Time': string;
	'Schedule End Time': string;
	'Staff Last Name': string;
};

export class FileHandlerState {
	rows = $state<ScheduleRow[]>([]);
	personRows = $state<ScheduleRow[]>([]);

	staffNames = $state<string[]>([]);
	selectedStaff = $state('');

	months = $state<string[]>([]);
	counts = new SvelteMap<string, number>([]);
	totalCount = $state(0);
	taskTotals = new SvelteMap<string, number>([]);

	taskCounts: Record<string, number> = $state({});
	taskObject = $state<{ task: string; count: number; percent: number }[]>([]);
	heatmapData = $state<{ task: string; month: Date; count: number }[]>([]);

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

	/**  
	// gets rows for selected staff and counts the tasks as well as total for each month
	*/
	getTaskCounts = () => {
		this.taskCounts = {};
		if (this.counts) this.counts.clear();

		// gets all rows for selected staff
		this.personRows = this.rows.filter((row: any) => row['Staff Last Name'] === this.selectedStaff);

		// gets task counts for selected staff
		for (const row of this.personRows) {
			// for room 9 procedures with extra -
			const originalTask = row['Task Abbreviation'].replace(/-$/, '').trim();

			const task = originalTask.replace(/\s*\(?(AM|PM)\)?/, '');
			const isHalfDay = task !== originalTask;

			// initiates task to 0 otherwise gets undefined
			this.taskCounts[task] ??= 0;

			// count days and half days
			this.taskCounts[task] += isHalfDay ? 0.5 : 1;

			// total the task count for each month
			this.getMonthlyCount(row['Schedule Date'], task, isHalfDay);
		}

		this.getTaskTotals(); // gets task totals for all year
		this.getTaskObject(); // gets the array of tasks with counts for display
		this.getTotalCount(); // gets total count for all tasks for person
		this.getMonthsBetween(); // gets the months for heatmap
	};

	getMonthlyCount = (inputDate: string, task: string, isHalfDay: boolean) => {
		const date = new SvelteDate(inputDate);

		const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

		const key = `${task}|${month}`;

		if (!this.counts.has(key)) {
			this.counts.set(key, isHalfDay ? 0.5 : 1);
		} else {
			this.counts.set(key, this.counts.get(key)! + (isHalfDay ? 0.5 : 1));
		}
	};

	/**  
	// total counts for individual task for person
	*/
	getTaskTotals = () => {
		for (const [key, count] of this.counts) {
			const [task] = key.split('|');

			this.taskTotals.set(task, (this.taskTotals.get(task) ?? 0) + count);
		}
	};

	/**  
	// calculate total count for selected staff, including all of the tasks and all of the months. Used to calculate percentage
	*/
	getTotalCount = () => {
		this.totalCount = Math.max(...this.taskObject.map((d) => d.count));
	};

	/**  
	// gets task data for selected staff.  
	*/
	getTaskObject = () => {
		// converts object to array of arrays and then map to array of objects and sort by count descending
		const data = Object.entries(this.taskCounts)
			.map(([task, count]) => ({
				task,
				count
			}))
			.sort((a, b) => a.task.localeCompare(b.task));
		// b.count - a.count sort by count

		const total = data.reduce((sum, item) => sum + item.count, 0);

		this.taskObject = data.map((item) => ({
			...item,
			percent: (item.count / total) * 100
		}));
	};

	/**  
	// gets all of the unique months  
	*/
	getMonthsBetween = () => {
		const dates = this.rows.map((row) => new SvelteDate(row['Schedule Date']));

		const minDate = new SvelteDate(Math.min(...dates.map((d) => d.getTime())));

		const maxDate = new SvelteDate(Math.max(...dates.map((d) => d.getTime())));

		const current = new SvelteDate(minDate.getFullYear(), minDate.getMonth(), 1);

		const monthsWithDuplicates = [];

		while (current <= maxDate) {
			monthsWithDuplicates.push(
				`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
			);

			current.setMonth(current.getMonth() + 1);
		}

		this.months = [...new SvelteSet(monthsWithDuplicates)].sort();
	};

	/**  
	// gets level of intensity for heatmap  
	*/
	getLevel(task: string, count: number) {
		if (count === 0) return 0;

		const average = (this.taskTotals.get(task) ?? 0) / this.months.length;

		const ratio = count / average;

		if (ratio < 0.5) return 1;
		if (ratio < 1) return 2;
		if (ratio < 1.5) return 3;

		return 4;
	}
}
