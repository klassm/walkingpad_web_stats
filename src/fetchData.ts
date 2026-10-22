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

const knownConnectionStates: readonly string[] = [
	"disconnected",
	"idle",
	"running",
];

export function useConnectionState() {
	return useQuery<ConnectionState>({
		queryKey: ["treadmill-connection"],
		initialData: "unknown",
		refetchInterval: 60_000,
		retry: false,
		queryFn: async () => {
			try {
				const { data } = await axios.get<{ state: string }>(
					"http://localhost:4934/treadmill/connection",
				);
				return knownConnectionStates.includes(data.state)
					? (data.state as ConnectionState)
					: "unknown";
			} catch {
				// Older macOS clients do not expose the connection endpoint.
				return "unknown";
			}
		},
	});
}

interface RawEntry {
	date: string;
	dateIso?: string;
	steps: number;
	distance: number;
}

const dateFormat = "yyyy-MM-dd";

export function useData() {
	return useQuery({
		queryKey: ["treadmill-data"],
		initialData: null,
		// The macOS client updates workouts.json while walking; refetch
		// regularly so today's numbers and streaks stay current.
		refetchInterval: 60_000,
		queryFn: fetchData,
	});
}

function parseDate(entry: RawEntry): DateTime {
	// Prefer full ISO timestamps (newer macOS clients); fall back to the
	// day-only string that the API has always exposed.
	const iso = entry.dateIso ? DateTime.fromISO(entry.dateIso) : null;
	if (iso?.isValid) {
		return iso;
	}
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
	>("http://localhost:4934/treadmill/workouts");
	return mapEntries(data);
}
