import { DateTime } from "luxon";
import type { Entry } from "../fetchData.js";

export interface WeekdayStat {
	weekday: number;
	label: string;
	averageSteps: number;
}

export function computeWeekdayStats(entries: Entry[]): WeekdayStat[] {
	const walkingDays = entries.filter((entry) => entry.steps > 0);
	const buckets = new Map<number, { total: number; count: number }>();

	for (const entry of walkingDays) {
		const weekday = entry.date.weekday;
		const bucket = buckets.get(weekday) ?? { total: 0, count: 0 };
		bucket.total += entry.steps;
		bucket.count += 1;
		buckets.set(weekday, bucket);
	}

	return [1, 2, 3, 4, 5, 6, 7].map((weekday) => {
		const bucket = buckets.get(weekday) ?? { total: 0, count: 0 };
		return {
			weekday,
			label: DateTime.fromObject({ weekday: weekday as 1 })
				.setLocale("en")
				.toFormat("ccc"),
			averageSteps:
				bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 0,
		};
	});
}
