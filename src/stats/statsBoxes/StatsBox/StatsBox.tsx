import { CardContent, Typography } from "@mui/material";
import type { FC } from "react";
import type { Delta } from "../../../utils/deltas.js";
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
	muted?: boolean;
	delta?: Delta;
}

const deltaArrows: Record<Delta["direction"], string> = {
	up: "▲",
	down: "▼",
	flat: "•",
};

const deltaColors: Record<Delta["direction"], string> = {
	up: "success.main",
	down: "error.main",
	flat: "text.secondary",
};

export const StatsBox: FC<Props> = ({
	title,
	date,
	description,
	entries,
	muted,
	delta,
}) => {
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
						mb: description || secondary.length > 0 || delta ? 0.5 : 0,
						color: muted ? "text.disabled" : "text.primary",
					}}
				>
					{primary}
				</Typography>
				{delta && (
					<Typography
						variant="body2"
						sx={{
							color: deltaColors[delta.direction],
							fontWeight: 600,
							fontSize: 13,
							mb: 1,
						}}
					>
						{deltaArrows[delta.direction]} {delta.percent} {delta.label}
					</Typography>
				)}
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
