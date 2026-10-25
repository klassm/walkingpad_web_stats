import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import type { FC, PropsWithChildren } from "react";
import { type Entry, useConnectionState } from "../fetchData.js";
import { StatsBar } from "../stats/StatsBar/StatsBar.js";
import { StatsBox } from "../stats/statsBoxes/StatsBox/StatsBox.js";
import { computeDelta, type Delta } from "../utils/deltas.js";
import { formatDistance, formatNumber } from "../utils/formatDistance.js";
import type { TreadmillLiveState } from "../ws/treadmillSocket.js";
import {
	useLiveTreadmill,
	useTreadmillSocketStatus,
} from "../ws/useTreadmillLive.js";
import { useTreadmillCommands } from "./useTreadmillCommands.js";

export function formatBeltTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	}
	return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function formatKmh(speed: number): string {
	return `${speed.toFixed(1)} km/h`;
}

const SectionCaption: FC<PropsWithChildren> = ({ children }) => (
	<Typography
		sx={{
			fontSize: 13,
			fontWeight: 700,
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "text.secondary",
			mb: 1,
		}}
	>
		{children}
	</Typography>
);

const LiveSpeedCard: FC<{
	live: TreadmillLiveState | null;
	disabled: boolean;
	onStart: () => void;
	onStop: () => void;
}> = ({ live, disabled, onStart, onStop }) => (
	<Box
		sx={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 2,
			flexWrap: "wrap",
			border: 1,
			borderColor: "divider",
			borderRadius: "16px",
			p: 2.5,
			bgcolor: "background.paper",
		}}
	>
		<Box>
			<SectionCaption>Speed</SectionCaption>
			<Box
				sx={{ fontSize: { xs: 32, sm: 40 }, fontWeight: 700, lineHeight: 1.1 }}
			>
				{live ? formatKmh(live.speed) : "—"}
			</Box>
		</Box>
		<Stack direction="row" spacing={1}>
			<Button variant="outlined" disabled={disabled} onClick={onStart}>
				Start
			</Button>
			<Button variant="outlined" disabled={disabled} onClick={onStop}>
				Stop
			</Button>
		</Stack>
	</Box>
);

const SessionTiles: FC<{ live: TreadmillLiveState | null }> = ({ live }) => {
	if (!live) {
		return (
			<StatsBar>
				<StatsBox title="Session" entries={["Waiting for live data…"]} muted />
			</StatsBar>
		);
	}
	return (
		<StatsBar>
			<StatsBox title="Steps" entries={[live.steps.toLocaleString()]} />
			<StatsBox
				title="Distance"
				entries={[`${(live.distance / 1000).toFixed(2)} km`]}
			/>
			<StatsBox
				title="Belt Time"
				entries={[formatBeltTime(live.walkingSeconds)]}
			/>
		</StatsBar>
	);
};

export interface TodayPanelProps {
	data: Entry[];
}

/**
 * The unified "Today" group: one component that adapts to the treadmill's
 * state instead of two overlapping groups ("Live" + "Today").
 * - Belt running: speed card with controls plus live session tiles.
 * - Belt idle: today's recorded steps (with the 7-day-Ø delta) and an inline
 *   Start button to begin a walk right from the card.
 */
export const TodayPanel: FC<TodayPanelProps> = ({ data }) => {
	const live = useLiveTreadmill();
	const socketStatus = useTreadmillSocketStatus();
	const { data: connection = "unknown" } = useConnectionState();
	const { controlsDisabled, error, clearError, run } = useTreadmillCommands();

	const isRunning = connection === "running";

	const todayEntry = data.find((entry) =>
		entry.date.hasSame(DateTime.now(), "day"),
	);
	const walkedToday = Boolean(todayEntry && todayEntry.steps > 0);

	const sevenDayAverage = (() => {
		const now = DateTime.now();
		const recentWalkingDays = data.filter(
			(entry) =>
				entry.steps > 0 && entry.date < now && !entry.date.hasSame(now, "day"),
		);
		const lastSeven = recentWalkingDays.slice(-7);
		if (lastSeven.length === 0) {
			return undefined;
		}
		return Math.round(
			lastSeven.reduce((sum, entry) => sum + entry.steps, 0) / lastSeven.length,
		);
	})();
	const todayDelta: Delta | undefined =
		todayEntry && walkedToday && sevenDayAverage
			? computeDelta(
					Math.round(todayEntry.steps),
					sevenDayAverage,
					"vs 7-day Ø",
				)
			: undefined;

	return (
		<Stack spacing={3}>
			{socketStatus === "offline" && (
				<Typography variant="body2" sx={{ color: "warning.main" }}>
					No live connection — live data unavailable. Full controls are
					available via the status chip in the header.
				</Typography>
			)}
			{isRunning ? (
				<>
					<LiveSpeedCard
						live={live}
						disabled={controlsDisabled}
						onStart={() => run("start")}
						onStop={() => run("stop")}
					/>
					<Box>
						<SectionCaption>Current session</SectionCaption>
						<SessionTiles live={live} />
					</Box>
				</>
			) : (
				<StatsBar>
					<StatsBox
						title="Today's Steps"
						entries={
							walkedToday && todayEntry
								? [
										`${formatNumber(Math.round(todayEntry.steps))} Schritte`,
										formatDistance(todayEntry.distance),
									]
								: ["No walk recorded yet"]
						}
						muted={!walkedToday}
						delta={todayDelta}
						action={
							<Button
								variant="contained"
								disabled={controlsDisabled}
								onClick={() => run("start")}
								sx={{
									borderRadius: 999,
									px: 2.5,
									textTransform: "none",
									fontWeight: 600,
								}}
							>
								Start walking
							</Button>
						}
					/>
				</StatsBar>
			)}
			<Snackbar
				open={error !== null}
				autoHideDuration={5_000}
				onClose={clearError}
			>
				<Alert severity="error" onClose={clearError}>
					{error}
				</Alert>
			</Snackbar>
		</Stack>
	);
};
