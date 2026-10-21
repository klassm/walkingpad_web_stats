import type { FC } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { ChartPaper, useChartTheme } from "../charts/ChartPaper.js";
import type { Entry } from "../fetchData.js";
import { chartPalette } from "../theme/theme.js";
import { computeCumulative } from "../utils/cumulative.js";
import { formatNumber } from "../utils/formatDistance.js";

export interface Props {
	data: Entry[];
	year: number;
}

export const CumulativeGraph: FC<Props> = ({ data, year }) => {
	const { gridStroke, axisTick, tooltipStyle } = useChartTheme();
	const points = computeCumulative(data, year);

	return (
		<ChartPaper>
			<AreaChart
				data={points}
				margin={{ top: 5, right: 5, left: 30, bottom: 5 }}
			>
				<defs>
					<linearGradient id="cumulativeFill" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="0%"
							stopColor={chartPalette.steps}
							stopOpacity={0.35}
						/>
						<stop
							offset="100%"
							stopColor={chartPalette.steps}
							stopOpacity={0.02}
						/>
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
				<XAxis
					dataKey="dateLabel"
					tick={{ ...axisTick, fontSize: 10 }}
					stroke={gridStroke}
					tickLine={false}
					minTickGap={40}
				/>
				<YAxis
					tick={{ ...axisTick, fontSize: 10 }}
					width={18}
					stroke={gridStroke}
					tickLine={false}
				/>
				<Tooltip
					formatter={(value) =>
						`${formatNumber(Math.round(Number(value)))} steps`
					}
					contentStyle={tooltipStyle}
				/>
				<Area
					name={`Cumulative ${year}`}
					type="monotone"
					dataKey="cumulative"
					stroke={chartPalette.steps}
					strokeWidth={2}
					fill="url(#cumulativeFill)"
				/>
			</AreaChart>
		</ChartPaper>
	);
};
