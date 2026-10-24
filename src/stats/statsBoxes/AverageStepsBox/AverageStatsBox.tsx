import { sumBy } from "lodash";
import { type FC, useMemo } from "react";
import type { Entry } from "../../../fetchData.js";
import { computeDelta } from "../../../utils/deltas.js";
import { formatDistance, formatNumber } from "../../../utils/formatDistance.js";
import { StatsBox } from "../StatsBox/StatsBox.js";

interface Props {
	title: string;
	data: Entry[];
	/** Data of the preceding period to compare the average against. */
	previousData?: Entry[];
	deltaLabel?: string;
}

export const AverageStatsBox: FC<Props> = ({
	title,
	data,
	previousData,
	deltaLabel,
}) => {
	const { walkingDays, averageMeters, averageSteps } = useMemo(() => {
		const walkingDays = data.filter((entry) => entry.steps > 0).length;
		const totalSteps = sumBy(data, (value) => value.steps);
		const totalMeters = sumBy(data, (value) => value.distance);

		return {
			averageSteps: walkingDays > 0 ? Math.round(totalSteps / walkingDays) : 0,
			averageMeters:
				walkingDays > 0 ? Math.round(totalMeters / walkingDays) : 0,
			walkingDays,
		};
	}, [data]);

	const delta = useMemo(() => {
		if (previousData?.length === 0) {
			return undefined;
		}
		const previousWalkingDays = previousData?.filter(
			(entry) => entry.steps > 0,
		).length;
		const previousAverage =
			previousWalkingDays && previousWalkingDays > 0
				? Math.round(
						sumBy(previousData, (entry) => entry.steps) / previousWalkingDays,
					)
				: 0;
		return computeDelta(averageSteps, previousAverage, deltaLabel ?? "");
	}, [averageSteps, previousData, deltaLabel]);

	if (walkingDays === 0) {
		// Keep the slot occupied for months without walks.
		return (
			<StatsBox title={title} entries={["No walks in this period"]} muted />
		);
	}
	return (
		<StatsBox
			title={title}
			entries={[
				`${formatNumber(averageSteps)} steps`,
				`${formatDistance(averageMeters)} / walking day`,
				`out of ${formatNumber(walkingDays)} walking days`,
			]}
			delta={delta}
		/>
	);
};
