import { groupBy, maxBy } from "lodash";
import { DateTime } from "luxon";
import type { Entry } from "../fetchData.js";
import type { DistanceStatsBoxEntry } from "./DistanceStatsBoxEntry.js";
import { sumFor } from "./sumFor.js";

export interface RecordEntry {
	entry: DistanceStatsBoxEntry;
	label: string;
}

function weekKey(date: DateTime): string {
	return `${date.weekYear}-W${String(date.weekNumber).padStart(2, "0")}`;
}

export function computeBestDay(entries: Entry[]): RecordEntry | undefined {
	const best = maxBy(entries, (entry) => entry.steps);
	if (!best) {
		return undefined;
	}
	return {
		entry: { steps: best.steps, distance: best.distance },
		label: best.date.toFormat("dd.MM.yyyy"),
	};
}

export function computeBestWeek(entries: Entry[]): RecordEntry | undefined {
	const groups = groupBy(
		entries.filter((entry) => entry.steps > 0),
		(entry) => weekKey(entry.date),
	);
	const weeks = Object.values(groups).map((group) => ({
		group,
		start: group[0].date,
	}));
	const best = maxBy(weeks, (week) => sumFor(week.group).steps);
	if (!best) {
		return undefined;
	}
	const monday = best.start.startOf("week");
	return {
		entry: sumFor(best.group),
		label: `CW ${monday.weekNumber} (${monday.toFormat("dd.MM.")})`,
	};
}

export function computeBestMonth(entries: Entry[]): RecordEntry | undefined {
	const groups = groupBy(
		entries.filter((entry) => entry.steps > 0),
		(entry) => entry.date.toFormat("yyyy-MM"),
	);
	const months = Object.entries(groups).map(([key, group]) => ({
		key,
		group,
	}));
	const best = maxBy(months, (month) => sumFor(month.group).steps);
	if (!best) {
		return undefined;
	}
	return {
		entry: sumFor(best.group),
		label: DateTime.fromFormat(best.key, "yyyy-MM").toFormat("LLLL yyyy"),
	};
}
