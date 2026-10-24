import type { FC } from "react";
import type { DistanceStatsBoxEntry } from "../../../utils/DistanceStatsBoxEntry.js";
import type { Delta } from "../../../utils/deltas.js";
import {
	formatCompact,
	formatDistance,
} from "../../../utils/formatDistance.js";
import { StatsBox } from "../StatsBox/StatsBox.js";

interface Props {
	title: string;
	entry: DistanceStatsBoxEntry | undefined;
	date: string | undefined;
	delta?: Delta;
	emptyMessage?: string;
}

export const DistanceStatsBox: FC<Props> = ({
	title,
	entry,
	date,
	delta,
	emptyMessage,
}) => {
	if (!entry) {
		// Keep the slot occupied so stat rows keep their shape even for
		// periods without any walks.
		return (
			<StatsBox
				title={title}
				entries={[emptyMessage ?? "No walks in this period"]}
				muted
			/>
		);
	}
	return (
		<StatsBox
			title={title}
			date={date ?? ""}
			entries={[
				`${formatCompact(Math.round(entry.steps))} steps`,
				formatDistance(entry.distance),
			]}
			delta={delta}
		/>
	);
};
