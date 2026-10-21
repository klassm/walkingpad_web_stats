import { Paper, useTheme } from "@mui/material";
import type { FC } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { Entry } from "../fetchData.js";
import { chartPalette } from "../theme/theme.js";

export interface Props {
	data: Entry[];
}

export const ByDayGraph: FC<Props> = ({ data }) => {
	const theme = useTheme();
	const formatted = data.map((entry) => ({
		...entry,
		date: entry.date.toFormat("dd.MM"),
	}));

	const axisTick = { fontSize: 12, fill: theme.palette.text.secondary };

	return (
		<Paper
			variant="outlined"
			sx={{ borderRadius: 3, p: 2.5, pt: 3, boxShadow: "none" }}
		>
			<ResponsiveContainer height={300}>
				<LineChart
					data={formatted}
					margin={{
						top: 15,
						right: 5,
						left: 30,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
					<XAxis
						tick={axisTick}
						dataKey="date"
						stroke={theme.palette.divider}
						tickLine={false}
					/>
					<YAxis
						tick={{ ...axisTick, fontSize: 10 }}
						width={18}
						stroke={theme.palette.divider}
						tickLine={false}
					/>
					<Legend wrapperStyle={{ fontSize: 13 }} />
					<Tooltip
						formatter={(value) => `${Math.ceil(Number(value))}`}
						contentStyle={{
							backgroundColor: theme.palette.background.paper,
							border: `1px solid ${theme.palette.divider}`,
							borderRadius: 10,
							fontSize: 13,
							color: theme.palette.text.primary,
						}}
					/>
					<Line
						name="Steps"
						type="monotone"
						dataKey="steps"
						stroke={chartPalette.steps}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Paper>
	);
};
