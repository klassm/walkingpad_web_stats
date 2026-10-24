import { maxBy } from "lodash";
import { type FC, useMemo } from "react";
import type { Entry } from "../../../fetchData.js";
import { computeDelta } from "../../../utils/deltas.js";
import { formatDate } from "../../../utils/formatDate.js";
import { DistanceStatsBox } from "../DistanceStatsBox/DistanceStatsBox.js";

interface Props {
	title: string;
	data: Entry[];
	/** Data of the preceding period to compare the maximum against. */
	previousData?: Entry[];
	deltaLabel?: string;
}

export const TopDayStatsBox: FC<Props> = ({
	title,
	data,
	previousData,
	deltaLabel,
}) => {
	const maxEntry = useMemo(() => maxBy(data, (entry) => entry.steps), [data]);
	const previousMax = useMemo(() => {
		const previous = previousData
			? maxBy(previousData, (entry) => entry.steps)
			: undefined;
		return previous?.steps ?? 0;
	}, [previousData]);
	const delta = useMemo(
		() =>
			maxEntry
				? computeDelta(maxEntry.steps, previousMax, deltaLabel ?? "")
				: undefined,
		[maxEntry, previousMax, deltaLabel],
	);

	return (
		<DistanceStatsBox
			title={title}
			entry={maxEntry}
			date={formatDate(maxEntry)}
			delta={delta}
		/>
	);
};
