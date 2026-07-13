<script>
	import { SquareChartGantt } from '@lucide/svelte';
</script>

<div class="collapse bg-base-200 border border-base-300">
	<input type="checkbox" />
	<div class="collapse-title font-semibold flex gap-x-2 items-center">
		<SquareChartGantt size={18} />How to Export Qgenda Schedule.
	</div>
	<div class="collapse-content bg-base-200 prose max-w-none">
		<div class="pt-6"></div>
		Click Schedule on Qgenda home:
		<img src="home.png" alt="" />
		Click on Reports:
		<img src="reports.png" alt="" />

		On the popup, Choose "Schedule Export" under "Report Type," choose "CSV" for format. Pick the
		time frame to export (max 1 year). Pick "Default" configuration:
		<img src="report_popup.png" alt="" />

		If you don't have configuration, you can create one by going to Settings:
		<img src="settings.png" alt="" />
		Click "Reports" and then "Schedule Exports":
		<img src="exports.png" alt="" />
		Click "+Schedule Export," give the export configuration a name:
		<img src="schedule_exports.png" alt="" />
		Make sure you have these fields:
		<img src="export_fields.png" alt="" />
		Now you should be able to see the configuration on the report page.
	</div>
</div>
