import { DateTime } from "luxon";
import { type FC, useMemo } from "react";
import { ByDayGraph } from "../../ByDayGraph/ByDayGraph.js";
import { ByMonthGraph } from "../../ByMonthGraph/ByMonthGraph.js";
import type { Entry } from "../../fetchData.js";
import { StatsBar } from "../StatsBar/StatsBar.js";
import { StatsGroup } from "../StatsGroup/StatsGroup.js";
import { AverageStatsBox } from "../statsBoxes/AverageStepsBox/AverageStatsBox.js";
import { TopDayStatsBox } from "../statsBoxes/TopDayStatsBox/TopDayStatsBox.js";
import { TotalStatsBox } from "../statsBoxes/TotalStatsBox/TotalStatsBox.js";

export interface StatsContentProps {
	data: Entry[];
	month: DateTime;
}
export const StatsContent: FC<StatsContentProps> = ({
	data,
	month: selectedMonth,
}) => {
	const monthData = useMemo(
		() =>
			data.filter(
				(entry) =>
					entry.date.year === selectedMonth.year &&
					entry.date.month === selectedMonth.month,
			),
		[data, selectedMonth],
	);

	const yearData = useMemo(
		() => data.filter((entry) => entry.date.year === selectedMonth.year),
		[selectedMonth, data],
	);

	const thirtyDaysAgo = DateTime.now().minus({ days: 30 });
	const last30Days = data.filter(
		({ date }) => date.toMillis() > thirtyDaysAgo.toMillis(),
	);

	const year = selectedMonth.year;
	const month = selectedMonth.toFormat("yyyy-MM");

	return (
		<div>
			<StatsGroup title="Top Day">
				<StatsBar>
					<TopDayStatsBox title="Overall" data={data} />
					<TopDayStatsBox title={`${year}`} data={yearData} />
					<TopDayStatsBox title={month} data={monthData} />
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Total">
				<StatsBar>
					<TotalStatsBox title="Overall" data={data} />
					<TotalStatsBox title={`${year}`} data={yearData} />
					<TotalStatsBox title={month} data={monthData} />
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Average">
				<StatsBar>
					<AverageStatsBox title="Overall" data={data} />
					<AverageStatsBox title={`${year}`} data={yearData} />
					<AverageStatsBox title={month} data={monthData} />
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Last 12 months">
				<ByMonthGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Last 30 days">
				<ByDayGraph data={last30Days} />
			</StatsGroup>
		</div>
	);
};
