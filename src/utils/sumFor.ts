import type { Entry } from "../fetchData";
import type { DistanceStatsBoxEntry } from "./DistanceStatsBoxEntry";

export function sumFor(data: Entry[]): DistanceStatsBoxEntry {
	return data.reduce(
		(prev, cur) => ({
			distance: prev.distance + cur.distance,
			steps: prev.steps + cur.steps,
		}),
		{ distance: 0, steps: 0 },
	);
}
