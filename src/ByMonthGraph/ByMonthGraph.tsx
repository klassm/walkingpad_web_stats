import { Paper, useTheme } from "@mui/material";
import { groupBy, mapValues, maxBy, sortBy } from "lodash";
import { DateTime } from "luxon";
import { type FC, useMemo } from "react";
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
	const theme = useTheme();

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

	const axisTick = { fontSize: 12, fill: theme.palette.text.secondary };
	const tooltipStyle = {
		backgroundColor: theme.palette.background.paper,
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: 10,
		fontSize: 13,
		color: theme.palette.text.primary,
	};

	return (
		<Paper
			variant="outlined"
			sx={{ borderRadius: 3, p: 2.5, pt: 3, boxShadow: "none" }}
		>
			<ResponsiveContainer height={300}>
				<LineChart
					data={viewableEntries}
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
						dataKey="month"
						stroke={theme.palette.divider}
						tickLine={false}
					/>
					<YAxis
						yAxisId="left"
						tick={{ ...axisTick, fontSize: 10 }}
						width={18}
						stroke={theme.palette.divider}
						tickLine={false}
					/>
					<YAxis
						yAxisId="right"
						orientation="right"
						tick={{ ...axisTick, fontSize: 10 }}
						width={18}
						stroke={theme.palette.divider}
						tickLine={false}
					/>
					<Legend wrapperStyle={{ fontSize: 13 }} />
					<Tooltip
						formatter={(value) => `${Math.round(Number(value))}`}
						contentStyle={tooltipStyle}
					/>
					<Line
						yAxisId="left"
						name="Total Steps"
						type="monotone"
						dataKey="totalSteps"
						stroke={chartPalette.steps}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>
					<Line
						yAxisId="left"
						name="Average Steps"
						type="monotone"
						dataKey="averageSteps"
						stroke={chartPalette.average}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>
					<Line
						yAxisId="left"
						name="Maximum Steps"
						type="monotone"
						dataKey="topSteps"
						stroke={chartPalette.maximum}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>
					<Line
						yAxisId="right"
						name="Walking Days"
						type="monotone"
						dataKey="walkingDays"
						stroke={chartPalette.walkingDays}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Paper>
	);
};
