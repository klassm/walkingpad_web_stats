export interface SectionDef {
	id: string;
	label: string;
}

export interface SectionGroupDef {
	title: string;
	sections: SectionDef[];
}

export const sectionGroups: SectionGroupDef[] = [
	{
		title: "Overview",
		sections: [
			{ id: "today", label: "Today" },
			{ id: "streaks", label: "Streaks" },
			{ id: "top-day", label: "Top Day" },
			{ id: "total", label: "Total" },
			{ id: "average", label: "Average" },
			{ id: "records", label: "Personal Records" },
		],
	},
	{
		title: "Trends",
		sections: [
			{ id: "weekday", label: "Weekday Average" },
			{ id: "cumulative", label: "Cumulative Progress" },
			{ id: "year-comparison", label: "Year Comparison" },
			{ id: "weekly-totals", label: "Weekly Totals" },
			{ id: "monthly-trend", label: "Monthly Trend" },
		],
	},
	{
		title: "History",
		sections: [
			{ id: "calendar", label: "Calendar" },
			{ id: "distribution", label: "Steps Distribution" },
			{ id: "last-30-days", label: "Last 30 Days" },
		],
	},
];

export const allSections: SectionDef[] = sectionGroups.flatMap(
	(group) => group.sections,
);
