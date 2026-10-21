import { CardContent, Typography } from "@mui/material";
import type { FC } from "react";
import {
	StyledCard,
	StyledDate,
	StyledEntry,
	StyledTitle,
} from "./StatsBox.styles.js";

interface Props {
	title: string;
	description?: string;
	date?: string;
	entries: string[];
}

export const StatsBox: FC<Props> = ({ title, date, description, entries }) => {
	if (entries.length === 0) {
		return null;
	}

	const [primary, ...secondary] = entries;

	return (
		<StyledCard variant="outlined">
			<CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
				<StyledTitle>{title}</StyledTitle>
				{date && (
					<StyledDate sx={{ mb: 1 }} variant="body2">
						{date}
					</StyledDate>
				)}
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						mb: description || secondary.length > 0 ? 1 : 0,
					}}
				>
					{primary}
				</Typography>
				{description && (
					<StyledDate variant="body2" sx={{ mb: 1 }}>
						{description}
					</StyledDate>
				)}
				{secondary.map((entry) => (
					<StyledEntry key={entry} variant="body2">
						{entry}
					</StyledEntry>
				))}
			</CardContent>
		</StyledCard>
	);
};
