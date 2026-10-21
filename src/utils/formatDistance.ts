export function formatNumber(value: number): string {
	return value.toLocaleString();
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
