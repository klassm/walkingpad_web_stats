import {
	Box,
	Paper,
	type Theme,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { DateTime } from "luxon";
import { type FC, useMemo } from "react";
import type { Entry } from "../fetchData.js";
import { formatDistance, formatNumber } from "../utils/formatDistance.js";

export interface Props {
	data: Entry[];
}

interface DayCell {
	date: DateTime;
	steps: number;
	distance: number;
}

const CELL_SIZE = 11;
const CELL_GAP = 2;
const CELL_STRIDE = CELL_SIZE + CELL_GAP;

function colorForSteps(steps: number, theme: Theme): string {
	if (steps <= 0) {
		return theme.palette.mode === "light"
			? "rgba(0, 0, 0, 0.06)"
			: "rgba(255, 255, 255, 0.06)";
	}
	if (steps < 3000) return `${theme.palette.primary.main}55`;
	if (steps < 6000) return `${theme.palette.primary.main}88`;
	if (steps < 10000) return `${theme.palette.primary.main}bb`;
	return theme.palette.primary.main;
}

export const CalendarHeatmap: FC<Props> = ({ data }) => {
	const theme = useTheme();

	const { weeks, monthLabels } = useMemo(() => {
		const byDate = new Map<string, Entry>();
		for (const entry of data) {
			byDate.set(entry.date.toFormat("yyyy-MM-dd"), entry);
		}

		const today = DateTime.local().startOf("day");
		const start = today.minus({ months: 12 }).startOf("week");
		const cells: (DayCell | null)[] = [];
		for (
			let date = start;
			date.toMillis() <= today.toMillis();
			date = date.plus({ days: 1 })
		) {
			const entry = byDate.get(date.toFormat("yyyy-MM-dd"));
			cells.push({
				date,
				steps: entry?.steps ?? 0,
				distance: entry?.distance ?? 0,
			});
		}
		// pad first week with leading nulls so rows align to weekday
		const leading = start.weekday - 1;
		const padded: (DayCell | null)[] = [
			...Array.from({ length: leading }, () => null),
			...cells,
		];

		const weeksOut: (DayCell | null)[][] = [];
		for (let index = 0; index < padded.length; index += 7) {
			weeksOut.push(padded.slice(index, index + 7));
		}

		const labels: { column: number; label: string }[] = [];
		weeksOut.forEach((week, index) => {
			const firstOfMonth = week.find((day) => day?.date.day === 1);
			if (firstOfMonth) {
				labels.push({
					column: index,
					label: firstOfMonth.date.toFormat("LLL"),
				});
			}
		});

		return { weeks: weeksOut, monthLabels: labels };
	}, [data]);

	return (
		<Paper
			variant="outlined"
			sx={{ borderRadius: 3, p: 2.5, pt: 2, boxShadow: "none" }}
		>
			<Box sx={{ display: "flex" }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
						gap: `${CELL_GAP}px`,
						width: 26,
						mt: 2.5,
					}}
				>
					{["Mon", "Wed", "Fri"].map((day, index) => (
						<Typography
							key={day}
							variant="caption"
							sx={{
								gridRow: index * 2 + 1,
								color: "text.secondary",
								fontSize: 9,
								alignSelf: "center",
								lineHeight: 1,
							}}
						>
							{day}
						</Typography>
					))}
				</Box>
				<Box sx={{ position: "relative", flex: 1 }}>
					<Box sx={{ position: "relative", height: 16 }}>
						{monthLabels.map(({ column, label }) => (
							<Typography
								key={`${column}-${label}`}
								variant="caption"
								sx={{
									position: "absolute",
									left: column * CELL_STRIDE,
									color: "text.secondary",
									fontSize: 10,
									lineHeight: "16px",
								}}
							>
								{label}
							</Typography>
						))}
					</Box>
					<Box sx={{ display: "flex", gap: `${CELL_GAP}px` }}>
						{weeks.map((week, weekIndex) => (
							<Box
								key={weekIndex}
								sx={{
									display: "grid",
									gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
									gap: `${CELL_GAP}px`,
								}}
							>
								{Array.from({ length: 7 }, (_, dayIndex) => {
									const day = week[dayIndex];
									if (!day) {
										return <Box key={dayIndex} />;
									}
									return (
										<Tooltip
											key={dayIndex}
											title={`${day.date.toFormat("dd.MM.yyyy")}: ${formatNumber(day.steps)} steps (${formatDistance(day.distance)})`}
											disableInteractive
										>
											<Box
												sx={{
													width: CELL_SIZE,
													height: CELL_SIZE,
													borderRadius: 0.75,
													backgroundColor: colorForSteps(day.steps, theme),
													"&:hover": {
														outline: `1px solid ${theme.palette.text.primary}`,
													},
												}}
											/>
										</Tooltip>
									);
								})}
							</Box>
						))}
					</Box>
				</Box>
			</Box>
		</Paper>
	);
};
