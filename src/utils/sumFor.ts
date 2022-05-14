import { Entry } from "../fetchData";
import { DistanceStatsBoxEntry } from "./DistanceStatsBoxEntry";

export function sumFor(data: Entry[]): DistanceStatsBoxEntry {
  return data.reduce((prev, cur) => ( {
    ...prev,
    distance: prev.distance + cur.distance,
    steps: prev.steps + cur.steps
  } ), { distance: 0, steps: 0 })
}
