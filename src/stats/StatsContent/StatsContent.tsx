import { DateTime } from "luxon";
import { type FC, useMemo } from "react";
import { ByDayGraph } from "../../ByDayGraph/ByDayGraph.js";
import { ByMonthGraph } from "../../ByMonthGraph/ByMonthGraph.js";
import { CalendarHeatmap } from "../../CalendarHeatmap/CalendarHeatmap.js";
import { CumulativeGraph } from "../../CumulativeGraph/CumulativeGraph.js";
import { DistributionGraph } from "../../DistributionGraph/DistributionGraph.js";
import type { Entry } from "../../fetchData.js";
import { LiveControl } from "../../live/LiveControl.js";
import { computeDelta } from "../../utils/deltas.js";
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
import { StreakCard } from "../statsBoxes/StreakBox/StreakCard.js";
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
	const weekendFreeStreaks = useMemo(
		() => computeStreaks(data, { weekendsAreFree: true }),
		[data],
	);
	const todayEntry = useMemo(
		() => data.find((entry) => entry.date.hasSame(DateTime.now(), "day")),
		[data],
	);
	const bestDay = useMemo(() => computeBestDay(data), [data]);
	const bestWeek = useMemo(() => computeBestWeek(data), [data]);
	const bestMonth = useMemo(() => computeBestMonth(data), [data]);

	// Comparison periods for the delta badges.
	const previousMonthData = useMemo(
		() =>
			data.filter((entry) =>
				entry.date.hasSame(selectedMonth.minus({ months: 1 }), "month"),
			),
		[data, selectedMonth],
	);
	const previousYearData = useMemo(
		() => data.filter((entry) => entry.date.year === selectedMonth.year - 1),
		[data, selectedMonth],
	);
	const sevenDayAverage = useMemo(() => {
		const now = DateTime.now();
		const recentWalkingDays = data.filter(
			(entry) =>
				entry.steps > 0 && entry.date < now && !entry.date.hasSame(now, "day"),
		);
		const lastSeven = recentWalkingDays.slice(-7);
		if (lastSeven.length === 0) {
			return undefined;
		}
		return Math.round(
			lastSeven.reduce((sum, entry) => sum + entry.steps, 0) / lastSeven.length,
		);
	}, [data]);
	const todayDelta = useMemo(
		() =>
			todayEntry && todayEntry.steps > 0 && sevenDayAverage
				? computeDelta(
						Math.round(todayEntry.steps),
						sevenDayAverage,
						"vs 7-day Ø",
					)
				: undefined,
		[todayEntry, sevenDayAverage],
	);

	const year = selectedMonth.year;

	// StatsGroup.index only staggers the entrance animation and saturates at
	// small values — derive it from render order instead of renumbering by
	// hand whenever a section is inserted.
	let groupIndexCounter = 0;
	const nextIndex = () => groupIndexCounter++;

	return (
		<div>
			<StatsGroup title="Live" id="live" index={nextIndex()}>
				<LiveControl />
			</StatsGroup>

			<StatsGroup title="Today" id="today" index={nextIndex()}>
				<StatsBar>
					<StatsBox
						title="Today's Steps"
						entries={[
							todayEntry && todayEntry.steps > 0
								? `${formatNumber(Math.round(todayEntry.steps))} Schritte`
								: "No walk recorded yet",
							...(todayEntry && todayEntry.steps > 0
								? [formatDistance(todayEntry.distance)]
								: []),
						]}
						delta={todayDelta}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Streaks" id="streaks" index={nextIndex()}>
				<StatsBar>
					<StreakCard
						streaks={streaks}
						weekendFreeStreaks={weekendFreeStreaks}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Top Day" id="top-day" index={nextIndex()}>
				<StatsBar>
					<TopDayStatsBox title="Overall" data={data} />
					<TopDayStatsBox
						title={`${year}`}
						data={yearData}
						previousData={previousYearData}
						deltaLabel={`vs ${year - 1}`}
					/>
					<TopDayStatsBox
						title={selectedMonth.toFormat("LLLL yyyy")}
						data={monthData}
						previousData={previousMonthData}
						deltaLabel={`vs ${selectedMonth.minus({ months: 1 }).toFormat("LLLL yyyy")}`}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Total" id="total" index={nextIndex()}>
				<StatsBar>
					<TotalStatsBox title="Overall" data={data} />
					<TotalStatsBox
						title={`${year}`}
						data={yearData}
						previousData={previousYearData}
						deltaLabel={`vs ${year - 1}`}
					/>
					<TotalStatsBox
						title={selectedMonth.toFormat("LLLL yyyy")}
						data={monthData}
						previousData={previousMonthData}
						deltaLabel={`vs ${selectedMonth.minus({ months: 1 }).toFormat("LLLL yyyy")}`}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Average" id="average" index={nextIndex()}>
				<StatsBar>
					<AverageStatsBox title="Overall" data={data} />
					<AverageStatsBox
						title={`${year}`}
						data={yearData}
						previousData={previousYearData}
						deltaLabel={`vs ${year - 1}`}
					/>
					<AverageStatsBox
						title={selectedMonth.toFormat("LLLL yyyy")}
						data={monthData}
						previousData={previousMonthData}
						deltaLabel={`vs ${selectedMonth.minus({ months: 1 }).toFormat("LLLL yyyy")}`}
					/>
				</StatsBar>
			</StatsGroup>

			<StatsGroup title="Personal Records" id="records" index={nextIndex()}>
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

			<StatsGroup title="Weekday Average" id="weekday" index={nextIndex()}>
				<WeekdayGraph data={data} />
			</StatsGroup>

			<StatsGroup
				title="Cumulative Progress"
				id="cumulative"
				index={nextIndex()}
			>
				<CumulativeGraph data={data} year={year} />
			</StatsGroup>

			<StatsGroup
				title="Year Comparison"
				id="year-comparison"
				index={nextIndex()}
			>
				<YearOverYearGraph data={data} year={year} />
			</StatsGroup>

			<StatsGroup title="Weekly Totals" id="weekly-totals" index={nextIndex()}>
				<WeeklyTotalsGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Monthly Trend" id="monthly-trend" index={nextIndex()}>
				<ByMonthGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Calendar" id="calendar" index={nextIndex()}>
				<CalendarHeatmap data={data} />
			</StatsGroup>

			<StatsGroup
				title="Steps Distribution"
				id="distribution"
				index={nextIndex()}
			>
				<DistributionGraph data={data} />
			</StatsGroup>

			<StatsGroup title="Last 30 days" id="last-30-days" index={nextIndex()}>
				<ByDayGraph data={last30Days} />
			</StatsGroup>
		</div>
	);
};
