import { DateTime } from "luxon";

import type { Entry } from "../fetchData.js";

export interface Streaks {
	current: number;
	longest: number;
}

export interface StreakOptions {
	/**
	 * Weekend days act as free passes: skipping a Saturday or Sunday never
	 * breaks a streak, while walking on a weekend still extends it.
	 */
	weekendsAreFree?: boolean;
}

function dayDistance(later: Entry, earlier: Entry): number {
	return Math.round(
		(later.date.startOf("day").toMillis() -
			earlier.date.startOf("day").toMillis()) /
			(24 * 60 * 60 * 1000),
	);
}

function isWeekend(date: DateTime): boolean {
	// luxon weekdays are 1 (Monday) through 7 (Sunday).
	return date.weekday >= 6;
}

export function computeStreaks(
	entries: Entry[],
	options: StreakOptions = {},
): Streaks {
	const weekendsAreFree = options.weekendsAreFree ?? false;

	const walkingDays = entries
		.filter((entry) => entry.steps > 0)
		.sort((a, b) => a.date.toMillis() - b.date.toMillis());

	if (walkingDays.length === 0) {
		return { current: 0, longest: 0 };
	}

	// A streak continues across a gap only when every missed day in the gap
	// is a free day (weekend, when weekends are free).
	const continues = (later: Entry, earlier: Entry): boolean => {
		const gap = dayDistance(later, earlier);
		if (gap !== 1) {
			if (!weekendsAreFree || gap < 1) {
				return false;
			}
			for (let offset = 1; offset < gap; offset += 1) {
				if (!isWeekend(earlier.date.plus({ days: offset }))) {
					return false;
				}
			}
		}
		return true;
	};

	let longest = 1;
	let running = 1;
	for (let index = 1; index < walkingDays.length; index += 1) {
		if (continues(walkingDays[index], walkingDays[index - 1])) {
			running += 1;
		} else {
			running = 1;
		}
		if (running > longest) {
			longest = running;
		}
	}

	// Compare calendar days (midnight to midnight), not wall-clock distance:
	// rounding now() against the last day's midnight wrongly reports 2 days
	// after ~noon on the following day.
	const todayStart = DateTime.now().startOf("day").toMillis();
	const last = walkingDays[walkingDays.length - 1];
	const daysSinceLast = Math.round(
		(todayStart - last.date.startOf("day").toMillis()) / (24 * 60 * 60 * 1000),
	);

	let current = 0;
	const missedDaysAreFree = (() => {
		if (daysSinceLast <= 1) {
			return true;
		}
		if (!weekendsAreFree) {
			return false;
		}
		for (let offset = 1; offset < daysSinceLast; offset += 1) {
			if (!isWeekend(last.date.plus({ days: offset }))) {
				return false;
			}
		}
		return true;
	})();
	if (missedDaysAreFree) {
		current = 1;
		for (let index = walkingDays.length - 1; index > 0; index -= 1) {
			if (continues(walkingDays[index], walkingDays[index - 1])) {
				current += 1;
			} else {
				break;
			}
		}
	}

	return { current, longest };
}
