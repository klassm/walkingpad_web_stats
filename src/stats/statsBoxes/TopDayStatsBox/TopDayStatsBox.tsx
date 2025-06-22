import { maxBy } from "lodash";
import { type FC, useMemo } from "react";
import type { Entry } from "../../../fetchData.js";
import { formatDate } from "../../../utils/formatDate.js";
import { DistanceStatsBox } from "../DistanceStatsBox/DistanceStatsBox.js";

interface Props {
	title: string;
	data: Entry[];
}

export const TopDayStatsBox: FC<Props> = ({ title, data }) => {
	const maxEntry = useMemo(() => maxBy(data, (entry) => entry.steps), [data]);

	return (
		<DistanceStatsBox
			title={title}
			entry={maxEntry}
			date={formatDate(maxEntry)}
		/>
	);
};
