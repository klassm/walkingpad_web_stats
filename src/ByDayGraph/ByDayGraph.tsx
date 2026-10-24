import type { FC } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { ChartPaper, useChartTheme } from "../charts/ChartPaper.js";
import type { Entry } from "../fetchData.js";
import { useChartPalette } from "../theme/theme.js";

export interface Props {
	data: Entry[];
}

export const ByDayGraph: FC<Props> = ({ data }) => {
	const { gridStroke, axisTick, tooltipStyle } = useChartTheme();
	const palette = useChartPalette();
	const formatted = data.map((entry) => ({
		...entry,
		date: entry.date.toFormat("dd.MM"),
	}));

	return (
		<ChartPaper>
			<LineChart
				data={formatted}
				margin={{ top: 15, right: 5, left: 30, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
				<XAxis
					tick={axisTick}
					dataKey="date"
					stroke={gridStroke}
					tickLine={false}
					minTickGap={32}
				/>
				<YAxis
					tick={{ ...axisTick, fontSize: 10 }}
					width={40}
					stroke={gridStroke}
					tickLine={false}
				/>
				<Tooltip
					formatter={(value) => `${Math.ceil(Number(value))} steps`}
					contentStyle={tooltipStyle}
					cursor={{ stroke: gridStroke, strokeDasharray: "3 3" }}
				/>
				<Line
					name="Steps"
					type="monotone"
					dataKey="steps"
					stroke={palette.steps}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
					animationDuration={600}
				/>
			</LineChart>
		</ChartPaper>
	);
};
