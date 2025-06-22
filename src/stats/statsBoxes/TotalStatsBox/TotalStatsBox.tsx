import { type FC, useMemo } from "react";
import type { Entry } from "../../../fetchData.js";
import { sumFor } from "../../../utils/sumFor.js";
import { DistanceStatsBox } from "../DistanceStatsBox/DistanceStatsBox.js";

interface Props {
	title: string;
	data: Entry[];
}

export const TotalStatsBox: FC<Props> = ({ title, data }) => {
	const total = useMemo(() => sumFor(data), [data]);

	return <DistanceStatsBox title={title} entry={total} date={undefined} />;
};
