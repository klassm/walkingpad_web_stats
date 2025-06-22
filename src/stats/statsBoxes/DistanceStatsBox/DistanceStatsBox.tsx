import type { FC } from "react";
import type { DistanceStatsBoxEntry } from "../../../utils/DistanceStatsBoxEntry";
import { StatsBox } from "../StatsBox/StatsBox";

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
				`${Math.round(entry.steps)} steps`,
				`${Math.round(entry.distance)} meters`,
			]}
		/>
	);
};
