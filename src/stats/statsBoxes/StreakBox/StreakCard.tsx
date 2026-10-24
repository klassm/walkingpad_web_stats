import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { hoverableCard } from "../../../theme/theme.js";

export interface StreakValues {
	current: number;
	longest: number;
}

interface Props {
	streaks: StreakValues;
	weekendFreeStreaks: StreakValues;
}

function formatStreak(value: number, singular: string, plural: string): string {
	return `${value} ${value === 1 ? singular : plural}`;
}

const cells = (
	streaks: StreakValues,
	weekendFreeStreaks: StreakValues,
): { label: string; value: string }[] => [
	{
		label: "Current",
		value: formatStreak(streaks.current, "day", "days"),
	},
	{
		label: "Best",
		value: formatStreak(streaks.longest, "day", "days"),
	},
	{
		label: "Current (weekends free)",
		value: formatStreak(weekendFreeStreaks.current, "day", "days"),
	},
	{
		label: "Best (weekends free)",
		value: formatStreak(weekendFreeStreaks.longest, "day", "days"),
	},
];

/** Merged 2x2 streak card spanning the whole streak row. */
export const StreakCard: FC<Props> = ({ streaks, weekendFreeStreaks }) => {
	return (
		<Card
			variant="outlined"
			sx={(theme) => ({
				flex: 1,
				minWidth: 180,
				borderRadius: 4, // 16px (sx multiplies shape.borderRadius)
				boxShadow: "none",
				border: 1,
				borderColor: "divider",
				...hoverableCard(theme),
			})}
		>
			<CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 1.5,
					}}
				>
					{cells(streaks, weekendFreeStreaks).map((cell) => (
						<Stack key={cell.label} direction="column" spacing={0}>
							<Typography variant="h5" sx={{ fontWeight: 700 }}>
								{cell.value}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ lineHeight: 1.4 }}
							>
								{cell.label}
							</Typography>
						</Stack>
					))}
				</Box>
			</CardContent>
		</Card>
	);
};
