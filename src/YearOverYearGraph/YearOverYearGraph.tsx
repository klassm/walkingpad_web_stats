import type { FC } from "react";
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
import { chartPalette } from "../theme/theme.js";
import { computeYearOverYear } from "../utils/yearOverYear.js";

export interface Props {
	data: Entry[];
	year: number;
}

export const YearOverYearGraph: FC<Props> = ({ data, year }) => {
	const { gridStroke, axisTick, tooltipStyle, legendStyle } = useChartTheme();
	const points = computeYearOverYear(data, year);

	return (
		<ChartPaper>
			<LineChart
				data={points}
				margin={{ top: 5, right: 5, left: 30, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
				<XAxis
					dataKey="monthLabel"
					tick={axisTick}
					stroke={gridStroke}
					tickLine={false}
				/>
				<YAxis
					tick={{ ...axisTick, fontSize: 10 }}
					width={18}
					stroke={gridStroke}
					tickLine={false}
				/>
				<Legend wrapperStyle={legendStyle} />
				<Tooltip
					formatter={(value) => `${Math.round(Number(value)).toLocaleString()}`}
					contentStyle={tooltipStyle}
				/>
				<Line
					name={`${year - 1}`}
					type="monotone"
					dataKey="previous"
					stroke={chartPalette.walkingDays}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
				/>
				<Line
					name={`${year}`}
					type="monotone"
					dataKey="current"
					stroke={chartPalette.steps}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4 }}
				/>
			</LineChart>
		</ChartPaper>
	);
};
