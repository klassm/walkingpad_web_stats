import { groupBy } from "lodash";
import { DateTime } from "luxon";
import type { Entry } from "../fetchData.js";
import { sumFor } from "./sumFor.js";

export interface YearOverYearPoint {
	monthLabel: string;
	current: number;
	previous: number;
}

export function computeYearOverYear(
	entries: Entry[],
	year: number,
): YearOverYearPoint[] {
	const relevant = entries.filter(
		(entry) => entry.date.year === year || entry.date.year === year - 1,
	);
	const byMonth = groupBy(
		relevant,
		(entry) =>
			`${entry.date.year}-${String(entry.date.month).padStart(2, "0")}`,
	);

	return Array.from({ length: 12 }, (_, index) => {
		const month = index + 1;
		const currentKey = `${year}-${String(month).padStart(2, "0")}`;
		const previousKey = `${year - 1}-${String(month).padStart(2, "0")}`;
		return {
			monthLabel: DateTime.fromObject({ year, month })
				.setLocale("de")
				.toFormat("LLL"),
			current: byMonth[currentKey] ? sumFor(byMonth[currentKey]).steps : 0,
			previous: byMonth[previousKey] ? sumFor(byMonth[previousKey]).steps : 0,
		};
	});
}
