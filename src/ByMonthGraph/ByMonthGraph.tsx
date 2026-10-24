import { groupBy, mapValues, maxBy, sortBy } from "lodash";
import { DateTime } from "luxon";
import { type FC, useMemo } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { ChartPaper, useChartTheme } from "../charts/ChartPaper.js";
import type { Entry } from "../fetchData.js";
import { useChartPalette } from "../theme/theme.js";
import { sumFor } from "../utils/sumFor.js";

export interface Props {
	data: Entry[];
}

interface ViewableEntry {
	totalSteps: number;
	averageSteps: number;
	topSteps: number;
	month: string;
	walkingDays: number;
}

export const ByMonthGraph: FC<Props> = ({ data }) => {
	const { gridStroke, axisTick, tooltipStyle, legendStyle } = useChartTheme();
	const palette = useChartPalette();

	const viewableEntries: ViewableEntry[] = useMemo(() => {
		const minDate = DateTime.now().minus({ month: 13 });
		const relevantData = data
			.filter((entry) => entry.date.toMillis() > minDate.toMillis())
			.filter((entry) => entry.steps > 0)
			.map((entry) => ({ ...entry, month: entry.date.toFormat("yyyy-MM") }));
		const groups = groupBy(relevantData, (data) => data.month);
		const mappedGroups = mapValues(groups, (group) => {
			const total = sumFor(group);
			const maxEntry = maxBy(group, (entry) => entry.steps);
			return {
				totalSteps: total.steps,
				averageSteps:
					group.length > 0 ? Math.round(total.steps / group.length) : 0,
				topSteps: maxEntry?.steps ?? 0,
				walkingDays: group.length,
			};
		});
		const allEntries = Object.entries(mappedGroups).map(([month, result]) => ({
			...result,
			month,
		}));
		return sortBy(allEntries, (entry) => entry.month);
	}, [data]);

	return (
		<ChartPaper>
			<LineChart
				data={viewableEntries}
				margin={{ top: 15, right: 5, left: 30, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
				<XAxis
					tick={axisTick}
					dataKey="month"
					stroke={gridStroke}
					tickLine={false}
					minTickGap={24}
				/>
				<YAxis
					yAxisId="left"
					tick={{ ...axisTick, fontSize: 10 }}
					width={40}
					stroke={gridStroke}
					tickLine={false}
				/>
				<YAxis
					yAxisId="right"
					orientation="right"
					tick={{ ...axisTick, fontSize: 10 }}
					width={40}
					stroke={gridStroke}
					tickLine={false}
					allowDecimals={false}
				/>
				<Legend wrapperStyle={legendStyle} />
				<Tooltip
					formatter={(value) => `${Math.round(Number(value))}`}
					contentStyle={tooltipStyle}
					cursor={{ stroke: gridStroke, strokeDasharray: "3 3" }}
				/>
				<Line
					yAxisId="left"
					name="Total Steps"
					type="monotone"
					dataKey="totalSteps"
					stroke={palette.steps}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
					animationDuration={600}
				/>
				<Line
					yAxisId="left"
					name="Average Steps"
					type="monotone"
					dataKey="averageSteps"
					stroke={palette.average}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
					animationDuration={600}
				/>
				<Line
					yAxisId="left"
					name="Maximum Steps"
					type="monotone"
					dataKey="topSteps"
					stroke={palette.maximum}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
					animationDuration={600}
				/>
				<Line
					yAxisId="right"
					name="Walking Days"
					type="monotone"
					dataKey="walkingDays"
					stroke={palette.walkingDays}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
					animationDuration={600}
				/>
			</LineChart>
		</ChartPaper>
	);
};
