import { DateTime } from "luxon";
import { type FC, useMemo } from "react";
import { ByDayGraph } from "../../ByDayGraph/ByDayGraph.js";
import { ByMonthGraph } from "../../ByMonthGraph/ByMonthGraph.js";
import { CalendarHeatmap } from "../../CalendarHeatmap/CalendarHeatmap.js";
import { CumulativeGraph } from "../../CumulativeGraph/CumulativeGraph.js";
import { DistributionGraph } from "../../DistributionGraph/DistributionGraph.js";
import type { Entry } from "../../fetchData.js";
import { formatDistance, formatNumber } from "../../utils/formatDistance.js";
import {
	computeBestDay,
	computeBestMonth,
	computeBestWeek,
} from "../../utils/records.js";
import { computeStreaks } from "../../utils/streaks.js";
import { WeekdayGraph } from "../../WeekdayGraph/WeekdayGraph.js";
import { WeeklyTotalsGraph } from "../../WeeklyTotalsGraph/WeeklyTotalsGraph.js";
import { YearOverYearGraph } from "../../YearOverYearGraph/YearOverYearGraph.js";
import { StatsBar } from "../StatsBar/StatsBar.js";
import { StatsGroup } from "../StatsGroup/StatsGroup.js";
import { AverageStatsBox } from "../statsBoxes/AverageStepsBox/AverageStatsBox.js";
import { DistanceStatsBox } from "../statsBoxes/DistanceStatsBox/DistanceStatsBox.js";
import { StatsBox } from "../statsBoxes/StatsBox/StatsBox.js";
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
	const last30Days = useMemo(
		() => data.filter(({ date }) => date.toMillis() > thirtyDaysAgo.toMillis()),
		[data],
	);

	const streaks = useMemo(() => computeStreaks(data), [data]);
	const todayEntry = useMemo(
		() => data.find((entry) => entry.date.hasSame(DateTime.now(), "day")),
		[data],
	);
	const bestDay = useMemo(() => computeBestDay(data), [data]);
	const bestWeek = useMemo(() => computeBestWeek(data), [data]);
	const bestMonth = useMemo(() => computeBestMonth(data), [data]);

	const year = selectedMonth.year;
	const month = selectedMonth.toFormat("yyyy-MM");

	return (
		<div>
			<StatsGroup title="Today" id="today">
				<StatsBar>
					<StatsBox
						title="Today's Steps"
						entries={[
							todayEntry && todayEntry.steps > 0
								? `${formatNumber(Math.round(todayEntry.steps))} steps`
								: "No walk recorded yet",
							...(todayEntry && todayEntry.steps > 0
								? [formatDistance(todayEntry.distance)]
								: []),
						]}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Streaks" id="streaks">
				<StatsBar>
					<StatsBox
						title="Current Streak"
						entries={[
							`${streaks.current} ${streaks.current === 1 ? "day" : "days"} in a row`,
						]}
					/>
					<StatsBox
						title="Longest Streak"
						entries={[
							`${streaks.longest} ${streaks.longest === 1 ? "day" : "days"} in a row`,
						]}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Top Day" id="top-day">
				<StatsBar>
					<TopDayStatsBox title="Overall" data={data} />
					<TopDayStatsBox title={`${year}`} data={yearData} />
					<TopDayStatsBox title={month} data={monthData} />
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Total" id="total">
				<StatsBar>
					<TotalStatsBox title="Overall" data={data} />
					<TotalStatsBox title={`${year}`} data={yearData} />
					<TotalStatsBox title={month} data={monthData} />
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Average" id="average">
				<StatsBar>
					<AverageStatsBox title="Overall" data={data} />
					<AverageStatsBox title={`${year}`} data={yearData} />
					<AverageStatsBox title={month} data={monthData} />
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Personal Records" id="records">
				<StatsBar>
					<DistanceStatsBox
						title="Best Day"
						entry={bestDay?.entry}
						date={bestDay?.label}
					/>
					<DistanceStatsBox
						title="Best Week"
						entry={bestWeek?.entry}
						date={bestWeek?.label}
					/>
					<DistanceStatsBox
						title="Best Month"
						entry={bestMonth?.entry}
						date={bestMonth?.label}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Weekday Average" id="weekday">
				<WeekdayGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Cumulative Progress" id="cumulative">
				<CumulativeGraph data={data} year={year} />
			</StatsGroup>

			<StatsGroup title="Year Comparison" id="year-comparison">
				<YearOverYearGraph data={data} year={year} />
			</StatsGroup>

			<StatsGroup title="Weekly Totals" id="weekly-totals">
				<WeeklyTotalsGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Monthly Trend" id="monthly-trend">
				<ByMonthGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Calendar" id="calendar">
				<CalendarHeatmap data={data} />
			</StatsGroup>

			<StatsGroup title="Steps Distribution" id="distribution">
				<DistributionGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Last 30 days" id="last-30-days">
				<ByDayGraph data={last30Days} />
			</StatsGroup>
		</div>
	);
};
