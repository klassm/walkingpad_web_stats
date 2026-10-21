import type { FC } from "react";
import type { DistanceStatsBoxEntry } from "../../../utils/DistanceStatsBoxEntry.js";
import { formatDistance, formatNumber } from "../../../utils/formatDistance.js";
import { StatsBox } from "../StatsBox/StatsBox.js";

interface Props {
	title: string;
	entry: DistanceStatsBoxEntry | undefined;
	date: string | undefined;
}

export const DistanceStatsBox: FC<Props> = ({ title, entry, date }) => {
	if (!entry) {
		return null;
	}
	return (
		<StatsBox
			title={title}
			date={date ?? ""}
			entries={[
				`${formatNumber(Math.round(entry.steps))} steps`,
				formatDistance(entry.distance),
			]}
		/>
	);
};
