import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { sortBy } from "lodash";
import { DateTime } from "luxon";

export interface Entry {
	date: DateTime;
	steps: number;
	distance: number;
}

export type ConnectionState = "disconnected" | "idle" | "running" | "unknown";

// Exported so the WS bridge (useTreadmillLive) applies the same validation.
export const knownConnectionStates: readonly string[] = [
	"disconnected",
	"idle",
	"running",
];

export function useConnectionState() {
	return useQuery<ConnectionState>({
		queryKey: ["treadmill-connection"],
		initialData: "unknown",
		// Treat the initial placeholder as ancient so the bootstrap fetch
		// runs on mount (websocket events own the cache afterwards; there
		// is no polling, so nothing else ever refetches this key).
		initialDataUpdatedAt: 0,
		refetchOnWindowFocus: false,
		retry: false,
		queryFn: async () => {
			const { data } = await axios.get<{ state: string }>(
				// 127.0.0.1, not localhost: the client's HTTP listener is pinned
				// to IPv4 loopback, and localhost can resolve to ::1 first.
				"http://127.0.0.1:4934/treadmill/connection",
			);
			if (!knownConnectionStates.includes(data.state)) {
				// Older macOS clients do not expose the connection endpoint.
				throw new Error(`unexpected connection state: ${data.state}`);
			}
			return data.state as ConnectionState;
		},
	});
}

interface RawEntry {
	date: string;
	steps: number;
	distance: number;
}

const dateFormat = "yyyy-MM-dd";

export function useData() {
	return useQuery({
		queryKey: ["treadmill-data"],
		initialData: null,
		initialDataUpdatedAt: 0,
		// Workout events invalidate this query over the websocket; HTTP
		// bootstraps once on mount (no polling, no focus refetch).
		refetchOnWindowFocus: false,
		queryFn: fetchData,
	});
}

function parseDate(entry: RawEntry): DateTime {
	// The API serves day-precision dates formatted in the treadmill host's
	// local timezone, which is exactly the day the dashboard aggregates by.
	return DateTime.fromFormat(entry.date, dateFormat);
}

function mapEntries(entries: RawEntry[]): Entry[] {
	const byDay = new Map<string, Entry>();
	for (const entry of entries) {
		const parsed = parseDate(entry);
		if (!parsed.isValid) {
			continue;
		}
		const day = parsed.startOf("day").toFormat(dateFormat);
		const existing = byDay.get(day);
		// Duplicate day entries (e.g. legacy zero-shadow entries) must not
		// erase the real one: sum the day's sessions instead.
		byDay.set(
			day,
			existing
				? {
						date: existing.date,
						steps: existing.steps + entry.steps,
						distance: existing.distance + entry.distance,
					}
				: {
						date: DateTime.fromFormat(day, dateFormat),
						steps: entry.steps,
						distance: entry.distance,
					},
		);
	}

	const sortedDays = [...byDay.keys()].sort();
	const start = (
		sortedDays.length === 0
			? DateTime.local()
			: DateTime.fromFormat(sortedDays[0], dateFormat)
	).startOf("month");
	const end =
		sortedDays.length === 0
			? DateTime.local()
			: DateTime.fromFormat(sortedDays[sortedDays.length - 1], dateFormat);

	// Zero-fill missing days between the first and last workout day.
	let currentDate = start;
	while (currentDate.toMillis() < end.toMillis()) {
		const formatted = currentDate.toFormat(dateFormat);
		if (!byDay.has(formatted)) {
			byDay.set(formatted, {
				date: currentDate,
				distance: 0,
				steps: 0,
			});
		}
		currentDate = currentDate.plus({ days: 1 });
	}

	return sortBy([...byDay.values()], (entry) => entry.date.toMillis());
}

export async function fetchData(): Promise<Entry[]> {
	const { data } = await axios.get<
		{ date: string; steps: number; distance: number }[]
	>("http://127.0.0.1:4934/treadmill/workouts");
	return mapEntries(data);
}
