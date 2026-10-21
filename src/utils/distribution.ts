import type { Entry } from "../fetchData.js";

export interface DistributionBucket {
	label: string;
	count: number;
}

const buckets: { label: string; min: number; max: number }[] = [
	{ label: "< 2k", min: 1, max: 2000 },
	{ label: "2k–5k", min: 2000, max: 5000 },
	{ label: "5k–8k", min: 5000, max: 8000 },
	{ label: "8k–10k", min: 8000, max: 10000 },
	{ label: "10k+", min: 10000, max: Number.POSITIVE_INFINITY },
];

export function computeDistribution(entries: Entry[]): DistributionBucket[] {
	const walkingDays = entries.filter((entry) => entry.steps > 0);
	return buckets.map(({ label, min, max }) => ({
		label,
		count: walkingDays.filter(
			(entry) => entry.steps >= min && entry.steps < max,
		).length,
	}));
}
