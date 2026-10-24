export interface Delta {
	direction: "up" | "down" | "flat";
	percent: string;
	label: string;
}

/** Percent comparison of a current period value against the preceding one. */
export function computeDelta(
	current: number,
	previous: number,
	label: string,
): Delta | undefined {
	if (!previous || previous <= 0) {
		return undefined;
	}
	const change = ((current - previous) / previous) * 100;
	const direction = Math.abs(change) < 1 ? "flat" : change > 0 ? "up" : "down";
	return {
		direction,
		percent: `${Math.abs(Math.round(change))}%`,
		label,
	};
}
