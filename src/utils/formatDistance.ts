export function formatNumber(value: number): string {
	return value.toLocaleString();
}

/** Compact number meant for big KPI values: 1.5 M, 23 k, 12 345. */
export function formatCompact(value: number): string {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 1,
		})} M`;
	}
	if (value >= 100_000) {
		return `${(value / 1000).toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 1,
		})} k`;
	}
	return formatNumber(value);
}

export function formatDistance(meters: number): string {
	if (meters >= 1000) {
		const km = meters / 1000;
		return `${km.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: km < 10 ? 2 : 1,
		})} km`;
	}
	return `${formatNumber(Math.round(meters))} m`;
}
