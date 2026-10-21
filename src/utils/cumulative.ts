import type { Entry } from "../fetchData.js";

export interface CumulativePoint {
	dateLabel: string;
	cumulative: number;
}

export function computeCumulative(
	entries: Entry[],
	year: number,
): CumulativePoint[] {
	const yearEntries = entries
		.filter((entry) => entry.date.year === year)
		.sort((a, b) => a.date.toMillis() - b.date.toMillis());

	let total = 0;
	return yearEntries.map((entry) => {
		total += entry.steps;
		return {
			dateLabel: entry.date.toFormat("dd.MM."),
			cumulative: total,
		};
	});
}
