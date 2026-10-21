import type { Entry } from "../fetchData.js";

export interface Streaks {
	current: number;
	longest: number;
}

function dayDistance(later: Entry, earlier: Entry): number {
	return Math.round(
		(later.date.startOf("day").toMillis() -
			earlier.date.startOf("day").toMillis()) /
			(24 * 60 * 60 * 1000),
	);
}

export function computeStreaks(entries: Entry[]): Streaks {
	const walkingDays = entries
		.filter((entry) => entry.steps > 0)
		.sort((a, b) => a.date.toMillis() - b.date.toMillis());

	if (walkingDays.length === 0) {
		return { current: 0, longest: 0 };
	}

	let longest = 1;
	let running = 1;
	for (let index = 1; index < walkingDays.length; index += 1) {
		const gap = dayDistance(walkingDays[index], walkingDays[index - 1]);
		if (gap === 1) {
			running += 1;
		} else {
			running = 1;
		}
		if (running > longest) {
			longest = running;
		}
	}

	const today = Date.now();
	const last = walkingDays[walkingDays.length - 1];
	const daysSinceLast = Math.round(
		(today - last.date.startOf("day").toMillis()) / (24 * 60 * 60 * 1000),
	);

	let current = 0;
	if (daysSinceLast <= 1) {
		current = 1;
		for (let index = walkingDays.length - 1; index > 0; index -= 1) {
			if (dayDistance(walkingDays[index], walkingDays[index - 1]) === 1) {
				current += 1;
			} else {
				break;
			}
		}
	}

	return { current, longest };
}
