import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";

import type { FC } from "react";
import { StatsBar } from "../stats/StatsBar/StatsBar.js";
import { StatsBox } from "../stats/statsBoxes/StatsBox/StatsBox.js";
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
			<Box
				sx={{
					fontSize: 13,
					fontWeight: 700,
					letterSpacing: "0.08em",
					textTransform: "uppercase",
					color: "text.secondary",
					mb: 0.5,
				}}
			>
				Speed
			</Box>
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

const LiveTiles: FC<{ live: TreadmillLiveState | null }> = ({ live }) => {
	if (!live) {
		return (
			<StatsBar>
				<StatsBox
					title="Current Session"
					entries={["Waiting for live data…"]}
					muted
				/>
			</StatsBar>
		);
	}
	return (
		<StatsBar>
			<StatsBox title="Steps" entries={[`${live.steps.toLocaleString()}`]} />
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

/**
 * Compact live summary: belt speed with inline start/stop plus session tiles.
 * The full control surface (speed presets, faster/slower, belt mode) lives in
 * the header status popover (TreadmillControlPanel).
 */
export const LiveControl: FC = () => {
	const live = useLiveTreadmill();
	const socketStatus = useTreadmillSocketStatus();
	const { controlsDisabled, error, clearError, run } = useTreadmillCommands();

	return (
		<Stack spacing={3}>
			{socketStatus === "offline" && (
				<Typography variant="body2" sx={{ color: "warning.main" }}>
					No live connection — live data unavailable. Full controls are
					available via the status chip in the header.
				</Typography>
			)}
			<LiveSpeedCard
				live={live}
				disabled={controlsDisabled}
				onStart={() => run("start")}
				onStop={() => run("stop")}
			/>
			<LiveTiles live={live} />
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
