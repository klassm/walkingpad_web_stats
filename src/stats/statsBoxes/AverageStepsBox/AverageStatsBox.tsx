import { sumBy } from "lodash";
import { type FC, useMemo } from "react";
import type { Entry } from "../../../fetchData.js";
import { StatsBox } from "../StatsBox/StatsBox.js";

interface Props {
	title: string;
	data: Entry[];
}

export const AverageStatsBox: FC<Props> = ({ title, data }) => {
	const { walkingDays, averageMeters, averageSteps } = useMemo(() => {
		const walkingDays = data.filter((entry) => entry.steps > 0).length;
		const totalSteps = sumBy(data, (value) => value.steps);
		const totalMeters = sumBy(data, (value) => value.distance);

		return {
			averageSteps: Math.round(totalSteps / walkingDays),
			averageMeters: Math.round(totalMeters / walkingDays),
			walkingDays,
		};
	}, [data]);
	return (
		<StatsBox
			title={title}
			entries={[
				`Out of ${walkingDays} walking days ...`,
				`${averageSteps} steps / walking day`,
				`${averageMeters} meters / walking day`,
			]}
		/>
	);
};
