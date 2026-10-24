import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartPaper, useChartTheme } from "../charts/ChartPaper.js";
import type { Entry } from "../fetchData.js";
import { useChartPalette } from "../theme/theme.js";
import { formatNumber } from "../utils/formatDistance.js";
import { computeWeekdayStats } from "../utils/weekdayStats.js";

export interface Props {
	data: Entry[];
}

export const WeekdayGraph: FC<Props> = ({ data }) => {
	const { gridStroke, axisTick, tooltipStyle } = useChartTheme();
	const palette = useChartPalette();
	const stats = computeWeekdayStats(data);

	return (
		<ChartPaper>
			<BarChart data={stats} margin={{ top: 5, right: 5, left: 30, bottom: 5 }}>
				<CartesianGrid
					strokeDasharray="3 3"
					stroke={gridStroke}
					vertical={false}
				/>
				<XAxis
					dataKey="label"
					tick={axisTick}
					stroke={gridStroke}
					tickLine={false}
				/>
				<YAxis
					tick={{ ...axisTick, fontSize: 10 }}
					width={18}
					stroke={gridStroke}
					tickLine={false}
					tickFormatter={(value: number) => formatNumber(value)}
				/>
				<Tooltip
					formatter={(value) =>
						`${formatNumber(Math.round(Number(value)))} steps`
					}
					contentStyle={tooltipStyle}
					cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
				/>
				<Bar
					dataKey="averageSteps"
					name="Average steps"
					fill={palette.steps}
					radius={[6, 6, 0, 0]}
					maxBarSize={48}
					animationDuration={600}
				/>
			</BarChart>
		</ChartPaper>
	);
};
