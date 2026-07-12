import * as Plot from '@observablehq/plot';
import type { Action } from 'svelte/action';

type DataPoint = {
	task: string;
	month: Date;
	count: number;
};

function makePlot(data: DataPoint[]) {
	return Plot.plot({
		width: 800,
		height: 800,
		marginLeft: 50,
		color: {
			scheme: 'YlGn',
			legend: true
		},
		x: {
			label: null,
			tickFormat: (d) =>
				new Date(d as Date).toLocaleDateString(undefined, {
					month: 'short',
					year: 'numeric'
				})
		},
		y: {
			label: null
		},
		marks: [
			Plot.cell(data, {
				x: 'month',
				y: 'task',
				fill: 'count',
				inset: 2
			}),
			Plot.text(data, {
				x: 'month',
				y: 'task',
				text: 'count'
			})
		]
	});
}

export const monthlyHeatmap: Action<HTMLElement, DataPoint[]> = (node, data) => {
	console.log('heatmap data', data);
	let chart = makePlot(data ?? []);
	node.append(chart);

	return {
		update(newData) {
			chart.remove();
			chart = makePlot(newData ?? []);
			node.append(chart);
		},
		destroy() {
			chart.remove();
		}
	};
};
