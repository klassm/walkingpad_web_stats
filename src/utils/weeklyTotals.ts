import { DateTime } from "luxon";
import type { Entry } from "../fetchData.js";
import { sumFor } from "./sumFor.js";

export interface WeeklyTotal {
	label: string;
	steps: number;
}

export function computeWeeklyTotals(
	entries: Entry[],
	weeks = 12,
): WeeklyTotal[] {
	const totals: WeeklyTotal[] = [];
	const now = DateTime.local().startOf("week");

	for (let offset = weeks - 1; offset >= 0; offset -= 1) {
		const weekStart = now.minus({ weeks: offset });
		const weekEnd = weekStart.plus({ days: 7 });
		const weekEntries = entries.filter(
			(entry) =>
				entry.date.toMillis() >= weekStart.toMillis() &&
				entry.date.toMillis() < weekEnd.toMillis(),
		);
		totals.push({
			label: weekStart.toFormat("dd.MM."),
			steps: sumFor(weekEntries).steps,
		});
	}

	return totals;
}
