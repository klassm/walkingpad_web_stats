import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { ChartPaper, useChartTheme } from "../charts/ChartPaper.js";
import type { Entry } from "../fetchData.js";
import { chartPalette } from "../theme/theme.js";
import { computeDistribution } from "../utils/distribution.js";

export interface Props {
	data: Entry[];
}

export const DistributionGraph: FC<Props> = ({ data }) => {
	const { gridStroke, axisTick, tooltipStyle } = useChartTheme();
	const buckets = computeDistribution(data);

	return (
		<ChartPaper>
			<BarChart
				data={buckets}
				margin={{ top: 5, right: 5, left: 30, bottom: 5 }}
			>
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
					allowDecimals={false}
				/>
				<Tooltip
					formatter={(value) => `${Math.round(Number(value))} days`}
					contentStyle={tooltipStyle}
					cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
				/>
				<Bar
					dataKey="count"
					name="Walking days"
					fill={chartPalette.maximum}
					radius={[6, 6, 0, 0]}
					maxBarSize={48}
				/>
			</BarChart>
		</ChartPaper>
	);
};
