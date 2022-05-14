import { DateTime } from "luxon";

export function formatDate(entry: { date: DateTime | undefined } | undefined): string | undefined {
  return entry?.date?.toLocaleString(DateTime.DATE_MED)
}

