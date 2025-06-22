import type { Entry } from "../fetchData.js";

export type DistanceStatsBoxEntry = Omit<Entry, "date">;
