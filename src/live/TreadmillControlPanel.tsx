import {
	Alert,
	Box,
	Button,
	Snackbar,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import type { FC } from "react";
import { SPEED_PRESETS, useTreadmillCommands } from "./useTreadmillCommands.js";

/**
 * Full treadmill control surface: start/stop, ±0.5 km/h, mode toggle and the
 * 0.5 km/h preset grid. Rendered inside the header status popover and usable
 * inline; command errors surface as a snackbar.
 */
export const TreadmillControlPanel: FC = () => {
	const {
		live,
		socketStatus,
		treadmillAvailable,
		controlsDisabled,
		error,
		clearError,
		run,
		setMode,
		activePreset,
	} = useTreadmillCommands();

	return (
		<Stack spacing={2}>
			{!treadmillAvailable && (
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					Treadmill not connected.
				</Typography>
			)}
			{socketStatus === "offline" && (
				<Typography variant="body2" sx={{ color: "warning.main" }}>
					No live connection — live data unavailable.
				</Typography>
			)}
			<Box sx={{ fontSize: 22, fontWeight: 700 }}>
				{live ? `${live.speed.toFixed(1)} km/h` : "—"}
			</Box>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(2, 1fr)",
					gap: 1,
				}}
			>
				<Button
					variant="outlined"
					disabled={controlsDisabled}
					onClick={() => run("start")}
				>
					Start
				</Button>
				<Button
					variant="outlined"
					disabled={controlsDisabled}
					onClick={() => run("stop")}
				>
					Stop
				</Button>
				<Button
					variant="outlined"
					disabled={controlsDisabled}
					onClick={() => run("slower")}
				>
					Slower
				</Button>
				<Button
					variant="outlined"
					disabled={controlsDisabled}
					onClick={() => run("faster")}
				>
					Faster
				</Button>
			</Box>
			<Stack
				direction="row"
				sx={{ alignItems: "center", justifyContent: "space-between" }}
			>
				<Box sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}>
					Belt mode
				</Box>
				<ToggleButtonGroup
					exclusive
					size="small"
					value={live?.walkingMode ?? null}
					onChange={(_, value: "manual" | "automatic" | null) => {
						if (value) {
							setMode(value);
						}
					}}
				>
					<ToggleButton value="manual" disabled={controlsDisabled}>
						Manual
					</ToggleButton>
					<ToggleButton value="automatic" disabled={controlsDisabled}>
						Automatic
					</ToggleButton>
				</ToggleButtonGroup>
			</Stack>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(5, 1fr)",
					gap: 1,
				}}
			>
				{SPEED_PRESETS.map((preset) => (
					<Button
						key={preset}
						variant={preset === activePreset ? "contained" : "outlined"}
						size="small"
						disabled={controlsDisabled}
						sx={{ minWidth: 0, px: 0.5 }}
						onClick={() => run("setSpeed", { speedKmh: preset })}
					>
						{preset.toFixed(1)}
					</Button>
				))}
			</Box>
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
